package com.roommate.service;

import com.roommate.dto.auth.AuthResponse;
import com.roommate.dto.auth.LoginRequest;
import com.roommate.dto.auth.RegisterRequest;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.OwnerProfile;
import com.roommate.entity.RoommatePreference;
import com.roommate.entity.StudentProfile;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final RoommatePreferenceRepository roommatePreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       OwnerProfileRepository ownerProfileRepository,
                       RoommatePreferenceRepository roommatePreferenceRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.roommatePreferenceRepository = roommatePreferenceRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Public registration does not allow self-assigning the ADMIN role");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.STUDENT) {
            StudentProfile profile = new StudentProfile(savedUser);
            studentProfileRepository.save(profile);

            RoommatePreference preference = new RoommatePreference(savedUser);
            roommatePreferenceRepository.save(preference);
        } else if (savedUser.getRole() == Role.OWNER) {
            OwnerProfile profile = new OwnerProfile(savedUser);
            ownerProfileRepository.save(profile);
        }

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended. Please contact platform support.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, UserDto.fromEntity(user));
    }
}
