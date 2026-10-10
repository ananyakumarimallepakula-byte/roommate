package com.roommate.dto.chat;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.Conversation;

import java.time.LocalDateTime;

public class ConversationDto {
    private Long id;
    private UserDto otherUser;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;

    public ConversationDto() {}

    public static ConversationDto fromEntity(Conversation c, Long currentUserId, long unreadCount, String lastMessage) {
        if (c == null) return null;
        ConversationDto dto = new ConversationDto();
        dto.setId(c.getId());
        if (c.getUser1().getId().equals(currentUserId)) {
            dto.setOtherUser(UserDto.fromEntity(c.getUser2()));
        } else {
            dto.setOtherUser(UserDto.fromEntity(c.getUser1()));
        }
        dto.setLastMessage(lastMessage);
        dto.setLastMessageAt(c.getLastMessageAt());
        dto.setUnreadCount(unreadCount);
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getOtherUser() { return otherUser; }
    public void setOtherUser(UserDto otherUser) { this.otherUser = otherUser; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}
