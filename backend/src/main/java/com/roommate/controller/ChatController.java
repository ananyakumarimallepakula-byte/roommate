package com.roommate.controller;

import com.roommate.dto.chat.ConversationDto;
import com.roommate.dto.chat.MessageDto;
import com.roommate.dto.chat.SendMessageRequest;
import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.common.PagedResponse;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<PagedResponse<ConversationDto>>> getConversations(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ConversationDto> response = chatService.getUserConversations(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MessageDto> messages = chatService.getConversationMessages(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SendMessageRequest request) {
        MessageDto sent = chatService.sendMessage(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Message sent", sent));
    }
}
