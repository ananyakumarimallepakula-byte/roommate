package com.roommate.service;

import com.roommate.dto.user.UpdateUserRequest;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.User;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDto getUserDtoById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntityById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Transactional
    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        User user = getUserEntityById(userId);
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }
}
