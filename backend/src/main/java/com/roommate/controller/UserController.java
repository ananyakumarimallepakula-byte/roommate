package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.user.UpdateUserRequest;
import com.roommate.dto.user.UserDto;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserDto user = userService.getUserDtoById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                 @Valid @RequestBody UpdateUserRequest request) {
        UserDto updated = userService.updateUser(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserDtoById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
