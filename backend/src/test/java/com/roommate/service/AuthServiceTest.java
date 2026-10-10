package com.roommate.service;

import com.roommate.dto.auth.AuthResponse;
import com.roommate.dto.auth.LoginRequest;
import com.roommate.dto.auth.RegisterRequest;
import com.roommate.entity.User;
import com.roommate.enums.Role;
import com.roommate.enums.UserStatus;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.DuplicateResourceException;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.OwnerProfileRepository;
import com.roommate.repository.RoommatePreferenceRepository;
import com.roommate.repository.StudentProfileRepository;
import com.roommate.repository.UserRepository;
import com.roommate.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private OwnerProfileRepository ownerProfileRepository;

    @Mock
    private RoommatePreferenceRepository roommatePreferenceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should reject registration when passwords do not match")
    void testPasswordMismatch() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("Password@123");
        req.setConfirmPassword("MismatchPass");
        req.setRole(Role.STUDENT);

        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("Should prevent public registration as ADMIN")
    void testPreventAdminRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("admin@test.com");
        req.setPassword("Password@123");
        req.setConfirmPassword("Password@123");
        req.setRole(Role.ADMIN);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(req));
        assertTrue(ex.getMessage().contains("ADMIN"));
    }

    @Test
    @DisplayName("Should reject duplicate email registration")
    void testDuplicateEmailRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@example.com");
        req.setPassword("Password@123");
        req.setConfirmPassword("Password@123");
        req.setRole(Role.STUDENT);

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("Should reject login for suspended accounts")
    void testSuspendedUserLogin() {
        LoginRequest req = new LoginRequest("suspended@example.com", "Password@123");
        User user = new User(1L, "suspended@example.com", "hash", "Suspended User", "1234567890", Role.STUDENT, UserStatus.SUSPENDED, null);

        when(userRepository.findByEmail("suspended@example.com")).thenReturn(Optional.of(user));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("suspended"));
    }
}
