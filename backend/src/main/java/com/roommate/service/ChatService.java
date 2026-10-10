package com.roommate.service;

import com.roommate.dto.chat.ConversationDto;
import com.roommate.dto.chat.MessageDto;
import com.roommate.dto.chat.SendMessageRequest;
import com.roommate.dto.common.PagedResponse;
import com.roommate.entity.Conversation;
import com.roommate.entity.Message;
import com.roommate.entity.User;
import com.roommate.enums.NotificationType;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.ConversationRepository;
import com.roommate.repository.MessageRepository;
import com.roommate.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       UserRepository userRepository,
                       NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ConversationDto> getUserConversations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<Conversation> convPage = conversationRepository.findByUserId(userId, pageable);

        Page<ConversationDto> dtoPage = convPage.map(conv -> {
            long unread = messageRepository.countUnreadMessages(conv.getId(), userId);
            List<Message> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId());
            String lastMsg = msgs.isEmpty() ? "" : msgs.get(msgs.size() - 1).getContent();
            return ConversationDto.fromEntity(conv, userId, unread, lastMsg);
        });

        return PagedResponse.of(dtoPage);
    }

    @Transactional
    public List<MessageDto> getConversationMessages(Long conversationId, Long currentUserId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        if (!conv.getUser1().getId().equals(currentUserId) && !conv.getUser2().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        // Mark messages as read
        messageRepository.markMessagesAsRead(conversationId, currentUserId);

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messages.stream().map(MessageDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(Long senderId, SendMessageRequest request) {
        if (senderId.equals(request.getRecipientId())) {
            throw new BadRequestException("You cannot send messages to yourself");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found: " + request.getRecipientId()));

        Conversation conv = conversationRepository.findBetweenUsers(senderId, request.getRecipientId())
                .orElseGet(() -> conversationRepository.save(new Conversation(sender, recipient)));

        conv.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conv);

        Message message = new Message(conv, sender, request.getContent().trim());
        Message saved = messageRepository.save(message);

        // Notify recipient
        notificationService.sendNotification(
                recipient,
                "New Message from " + sender.getFullName(),
                request.getContent().length() > 50 ? request.getContent().substring(0, 47) + "..." : request.getContent(),
                NotificationType.MESSAGE,
                conv.getId(),
                "CONVERSATION"
        );

        return MessageDto.fromEntity(saved);
    }
}
