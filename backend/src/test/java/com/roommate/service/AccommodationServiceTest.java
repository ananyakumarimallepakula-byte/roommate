package com.roommate.service;

import com.roommate.dto.accommodation.CreateAccommodationRequest;
import com.roommate.entity.Accommodation;
import com.roommate.entity.SavedListing;
import com.roommate.entity.User;
import com.roommate.enums.FurnishingStatus;
import com.roommate.enums.Role;
import com.roommate.enums.RoomType;
import com.roommate.enums.UserStatus;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccommodationServiceTest {

    @Mock
    private AccommodationRepository accommodationRepository;

    @Mock
    private AccommodationImageRepository accommodationImageRepository;

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private SavedListingRepository savedListingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AccommodationService accommodationService;

    private User studentUser;
    private User ownerUser;

    @BeforeEach
    void setUp() {
        studentUser = new User(1L, "student@example.com", "hash", "Student", "9876543210", Role.STUDENT, UserStatus.ACTIVE, null);
        ownerUser = new User(2L, "owner@example.com", "hash", "Owner", "9876543211", Role.OWNER, UserStatus.ACTIVE, null);
    }

    @Test
    @DisplayName("Students cannot create accommodation listings")
    void testStudentCannotCreateListing() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(studentUser));

        CreateAccommodationRequest req = new CreateAccommodationRequest();
        req.setTitle("Student Listing");
        req.setCity("Delhi");
        req.setLocality("Hauz Khas");
        req.setAddress("Street 1");
        req.setRent(new BigDecimal("10000"));
        req.setSecurityDeposit(new BigDecimal("20000"));
        req.setRoomType(RoomType.PRIVATE);
        req.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
        req.setAvailableFrom(LocalDate.now());

        assertThrows(UnauthorizedException.class, () -> accommodationService.createAccommodation(1L, req));
    }

    @Test
    @DisplayName("User cannot delete listing owned by someone else")
    void testCannotDeleteOtherUsersListing() {
        Accommodation accom = new Accommodation();
        accom.setId(10L);
        accom.setOwner(ownerUser);

        when(accommodationRepository.findById(10L)).thenReturn(Optional.of(accom));
        when(userRepository.findById(1L)).thenReturn(Optional.of(studentUser));

        assertThrows(UnauthorizedException.class, () -> accommodationService.deleteAccommodation(10L, 1L));
    }

    @Test
    @DisplayName("Toggle saved listing adds if absent, removes if present")
    void testToggleSaveListing() {
        Accommodation accom = new Accommodation();
        accom.setId(10L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(studentUser));
        when(accommodationRepository.findById(10L)).thenReturn(Optional.of(accom));
        when(savedListingRepository.findByUserIdAndAccommodationId(1L, 10L)).thenReturn(Optional.empty());

        boolean saved = accommodationService.toggleSaveListing(1L, 10L);
        assertTrue(saved, "Should return true when saving previously unsaved listing");
        verify(savedListingRepository, times(1)).save(any());

        // When already saved
        SavedListing sl = new SavedListing(studentUser, accom);
        when(savedListingRepository.findByUserIdAndAccommodationId(1L, 10L)).thenReturn(Optional.of(sl));

        boolean unsaved = accommodationService.toggleSaveListing(1L, 10L);
        assertFalse(unsaved, "Should return false when removing saved listing");
        verify(savedListingRepository, times(1)).delete(sl);
    }
}
