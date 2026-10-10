package com.roommate.config;

import com.roommate.entity.*;
import com.roommate.enums.*;
import com.roommate.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final RoommatePreferenceRepository roommatePreferenceRepository;
    private final AmenityRepository amenityRepository;
    private final AccommodationRepository accommodationRepository;
    private final AccommodationImageRepository accommodationImageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository studentProfileRepository,
                           OwnerProfileRepository ownerProfileRepository,
                           RoommatePreferenceRepository roommatePreferenceRepository,
                           AmenityRepository amenityRepository,
                           AccommodationRepository accommodationRepository,
                           AccommodationImageRepository accommodationImageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.roommatePreferenceRepository = roommatePreferenceRepository;
        this.amenityRepository = amenityRepository;
        this.accommodationRepository = accommodationRepository;
        this.accommodationImageRepository = accommodationImageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        try {
            initAmenities();
            initUsersAndData();
            logger.info("Data initialization check completed successfully.");
        } catch (Exception e) {
            logger.warn("Data initialization info: {}", e.getMessage());
        }
    }

    private void initAmenities() {
        if (amenityRepository.count() == 0) {
            List<Amenity> list = Arrays.asList(
                    new Amenity(null, "High-Speed WiFi", "wifi"),
                    new Amenity(null, "Air Conditioner (AC)", "wind"),
                    new Amenity(null, "Geyser / Hot Water", "droplet"),
                    new Amenity(null, "24x7 Power Backup", "zap"),
                    new Amenity(null, "RO Drinking Water", "cup"),
                    new Amenity(null, "Washing Machine", "disc"),
                    new Amenity(null, "Attached Bathroom", "check-circle"),
                    new Amenity(null, "CCTV & Security", "shield"),
                    new Amenity(null, "Refrigerator", "box"),
                    new Amenity(null, "Meal Service / Mess", "coffee"),
                    new Amenity(null, "Private Balcony", "sun"),
                    new Amenity(null, "Elevator / Lift", "arrow-up")
            );
            amenityRepository.saveAll(list);
            logger.info("Initialized default amenities.");
        }
    }

    private void initUsersAndData() {
        // Ensure Admin user
        if (!userRepository.existsByEmail("admin@roommate.com")) {
            User admin = new User(null, "admin@roommate.com", passwordEncoder.encode("Password@123"),
                    "System Administrator", "+919876543210", Role.ADMIN, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop");
            userRepository.save(admin);
            logger.info("Created default administrator: admin@roommate.com");
        }

        // Ensure Owner Rajesh
        User ownerRajesh = userRepository.findByEmail("rajesh.verma@example.com").orElse(null);
        if (ownerRajesh == null) {
            ownerRajesh = new User(null, "rajesh.verma@example.com", passwordEncoder.encode("Password@123"),
                    "Rajesh Verma", "+919876543211", Role.OWNER, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop");
            ownerRajesh = userRepository.save(ownerRajesh);

            OwnerProfile op = new OwnerProfile(ownerRajesh);
            op.setCompanyName("Skyline Urban Living");
            op.setAddress("Plot 44, Sector 15, Hauz Khas, New Delhi");
            op.setIsVerified(true);
            ownerProfileRepository.save(op);
        }

        // Ensure Owner Sunita
        User ownerSunita = userRepository.findByEmail("sunita.sharma@example.com").orElse(null);
        if (ownerSunita == null) {
            ownerSunita = new User(null, "sunita.sharma@example.com", passwordEncoder.encode("Password@123"),
                    "Sunita Sharma", "+919876543212", Role.OWNER, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop");
            ownerSunita = userRepository.save(ownerSunita);

            OwnerProfile op2 = new OwnerProfile(ownerSunita);
            op2.setCompanyName("Sunshine Student Homes");
            op2.setAddress("B-12, GTB Nagar, North Campus, New Delhi");
            op2.setIsVerified(true);
            ownerProfileRepository.save(op2);
        }

        // Ensure Student Aarav
        User studentAarav = userRepository.findByEmail("aarav.patel@example.com").orElse(null);
        if (studentAarav == null) {
            studentAarav = new User(null, "aarav.patel@example.com", passwordEncoder.encode("Password@123"),
                    "Aarav Patel", "+919876543221", Role.STUDENT, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop");
            studentAarav = userRepository.save(studentAarav);

            StudentProfile sp1 = new StudentProfile(studentAarav);
            sp1.setAge(21);
            sp1.setGender(Gender.MALE);
            sp1.setCollege("IIT Delhi");
            sp1.setCourse("B.Tech Computer Science");
            sp1.setStudyYear("3rd Year");
            sp1.setBio("Passionate developer and robotics enthusiast. Love quiet study hours, coding marathons, and fitness.");
            studentProfileRepository.save(sp1);

            RoommatePreference rp1 = new RoommatePreference(studentAarav);
            rp1.setPreferredCity("New Delhi");
            rp1.setPreferredLocality("Hauz Khas");
            rp1.setMinBudget(new BigDecimal("10000"));
            rp1.setMaxBudget(new BigDecimal("16000"));
            rp1.setRoomType(RoomType.PRIVATE);
            rp1.setTargetMoveInDate(LocalDate.now().plusDays(20));
            rp1.setSleepSchedule(SleepSchedule.NIGHT_OWL);
            rp1.setStudyHabit(StudyHabit.SILENT_STUDY);
            rp1.setCleanlinessLevel(CleanlinessLevel.VERY_CLEAN);
            rp1.setSmokingPreference(SmokingPreference.NON_SMOKER);
            rp1.setPetPreference(PetPreference.PET_FRIENDLY);
            rp1.setFoodPreference(FoodPreference.VEGETARIAN);
            rp1.setInterests("Coding,Gaming,Gym,Music");
            roommatePreferenceRepository.save(rp1);
        }

        // Ensure Student Rohit
        User studentRohit = userRepository.findByEmail("rohit.sharma@example.com").orElse(null);
        if (studentRohit == null) {
            studentRohit = new User(null, "rohit.sharma@example.com", passwordEncoder.encode("Password@123"),
                    "Rohit Sharma", "+919876543222", Role.STUDENT, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&fit=crop");
            studentRohit = userRepository.save(studentRohit);

            StudentProfile sp2 = new StudentProfile(studentRohit);
            sp2.setAge(21);
            sp2.setGender(Gender.MALE);
            sp2.setCollege("DTU Delhi");
            sp2.setCourse("B.Tech Mechanical Engineering");
            sp2.setStudyYear("3rd Year");
            sp2.setBio("Tech geek, gamer, and football fan. Looking for a neat and easy-going roommate near South Delhi.");
            studentProfileRepository.save(sp2);

            RoommatePreference rp2 = new RoommatePreference(studentRohit);
            rp2.setPreferredCity("New Delhi");
            rp2.setPreferredLocality("Hauz Khas");
            rp2.setMinBudget(new BigDecimal("9500"));
            rp2.setMaxBudget(new BigDecimal("15500"));
            rp2.setRoomType(RoomType.PRIVATE);
            rp2.setTargetMoveInDate(LocalDate.now().plusDays(20));
            rp2.setSleepSchedule(SleepSchedule.NIGHT_OWL);
            rp2.setStudyHabit(StudyHabit.SILENT_STUDY);
            rp2.setCleanlinessLevel(CleanlinessLevel.VERY_CLEAN);
            rp2.setSmokingPreference(SmokingPreference.NON_SMOKER);
            rp2.setPetPreference(PetPreference.PET_FRIENDLY);
            rp2.setFoodPreference(FoodPreference.VEGETARIAN);
            rp2.setInterests("Coding,Gaming,Football,Gym");
            roommatePreferenceRepository.save(rp2);
        }

        // Ensure Student Priya
        User studentPriya = userRepository.findByEmail("priya.singh@example.com").orElse(null);
        if (studentPriya == null) {
            studentPriya = new User(null, "priya.singh@example.com", passwordEncoder.encode("Password@123"),
                    "Priya Singh", "+919876543223", Role.STUDENT, UserStatus.ACTIVE,
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop");
            studentPriya = userRepository.save(studentPriya);

            StudentProfile sp3 = new StudentProfile(studentPriya);
            sp3.setAge(20);
            sp3.setGender(Gender.FEMALE);
            sp3.setCollege("Delhi University - Miranda House");
            sp3.setCourse("B.A. Economics (Hons)");
            sp3.setStudyYear("2nd Year");
            sp3.setBio("Loves literature, early morning yoga, and healthy cooking. Very mindful of cleanliness and personal space.");
            studentProfileRepository.save(sp3);

            RoommatePreference rp3 = new RoommatePreference(studentPriya);
            rp3.setPreferredCity("New Delhi");
            rp3.setPreferredLocality("North Campus");
            rp3.setMinBudget(new BigDecimal("7000"));
            rp3.setMaxBudget(new BigDecimal("12000"));
            rp3.setRoomType(RoomType.SHARED);
            rp3.setTargetMoveInDate(LocalDate.now().plusDays(25));
            rp3.setSleepSchedule(SleepSchedule.EARLY_BIRD);
            rp3.setStudyHabit(StudyHabit.SILENT_STUDY);
            rp3.setCleanlinessLevel(CleanlinessLevel.VERY_CLEAN);
            rp3.setSmokingPreference(SmokingPreference.NON_SMOKER);
            rp3.setPetPreference(PetPreference.NO_PETS);
            rp3.setFoodPreference(FoodPreference.VEGETARIAN);
            rp3.setInterests("Reading,Yoga,Art,Cooking");
            roommatePreferenceRepository.save(rp3);
        }

        // Ensure sample approved accommodation exists
        if (accommodationRepository.count() == 0 && ownerRajesh != null) {
            Accommodation a1 = new Accommodation();
            a1.setOwner(ownerRajesh);
            a1.setTitle("Luxury Studio Room near Hauz Khas Metro");
            a1.setDescription("Spacious, well-ventilated studio apartment equipped with air conditioning, premium wooden bed, study desk, ergonomic chair, and attached bath. Perfect for college students and scholars.");
            a1.setCity("New Delhi");
            a1.setLocality("Hauz Khas");
            a1.setAddress("A-32, Kaushalya Park, Hauz Khas, New Delhi");
            a1.setRent(new BigDecimal("13500.00"));
            a1.setSecurityDeposit(new BigDecimal("27000.00"));
            a1.setRoomType(RoomType.PRIVATE);
            a1.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a1.setGenderPreference(GenderPreference.ANY);
            a1.setAvailableFrom(LocalDate.now().plusDays(5));
            a1.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a1.setModerationStatus(ModerationStatus.APPROVED);
            a1.setHouseRules("No loud music after 11 PM. Keep common areas clean. Guests allowed with prior notice.");

            List<Amenity> ams = amenityRepository.findAll();
            if (!ams.isEmpty()) {
                a1.setAmenities(new HashSet<>(ams.subList(0, Math.min(6, ams.size()))));
            }
            Accommodation savedA1 = accommodationRepository.save(a1);

            AccommodationImage img1 = new AccommodationImage(savedA1, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop", true);
            AccommodationImage img2 = new AccommodationImage(savedA1, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&fit=crop", false);
            accommodationImageRepository.save(img1);
            accommodationImageRepository.save(img2);

            Accommodation a2 = new Accommodation();
            a2.setOwner(ownerRajesh);
            a2.setTitle("Premium 2BHK Shared Flat with Balcony");
            a2.setDescription("Modern 2-bedroom apartment with scenic park views. Includes modular kitchen, high-speed fiber internet, refrigerator, and power backup. 5 mins walk to IIT Delhi.");
            a2.setCity("New Delhi");
            a2.setLocality("Hauz Khas");
            a2.setAddress("C-18, Hauz Khas Enclave, New Delhi");
            a2.setRent(new BigDecimal("9500.00"));
            a2.setSecurityDeposit(new BigDecimal("19000.00"));
            a2.setRoomType(RoomType.SHARED);
            a2.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a2.setGenderPreference(GenderPreference.MALE_ONLY);
            a2.setAvailableFrom(LocalDate.now().plusDays(10));
            a2.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a2.setModerationStatus(ModerationStatus.APPROVED);
            a2.setHouseRules("Non-smoking premises. Mutual respect for flatmates study timings.");
            Accommodation savedA2 = accommodationRepository.save(a2);

            AccommodationImage img2_1 = new AccommodationImage(savedA2, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop", true);
            accommodationImageRepository.save(img2_1);

            logger.info("Initialized default approved accommodations.");
        }
    }
}
