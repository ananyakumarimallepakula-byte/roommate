package com.roommate.config;

import com.roommate.entity.*;
import com.roommate.enums.*;
import com.roommate.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
@ConditionalOnProperty(name = "app.data-init.enabled", havingValue = "true", matchIfMissing = true)
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
            List<Amenity> ams = amenityRepository.findAll();

            // 1. Luxury Studio Room near Hauz Khas Metro
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
            if (!ams.isEmpty()) {
                a1.setAmenities(new HashSet<>(ams.subList(0, Math.min(6, ams.size()))));
            }
            Accommodation savedA1 = accommodationRepository.save(a1);
            accommodationImageRepository.save(new AccommodationImage(savedA1, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA1, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&fit=crop", false));

            // 2. Premium 2BHK Shared Flat with Balcony
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
            accommodationImageRepository.save(new AccommodationImage(savedA2, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop", true));

            // 3. Cozy PG near North Campus
            Accommodation a3 = new Accommodation();
            a3.setOwner(ownerSunita);
            a3.setTitle("Cozy PG Room near North Campus DU");
            a3.setDescription("Comfortable single-occupancy PG with home-cooked meals, laundry service, and 24/7 security. Walking distance to Delhi University North Campus and metro station.");
            a3.setCity("New Delhi");
            a3.setLocality("North Campus");
            a3.setAddress("F-14, Vijay Nagar, North Campus, New Delhi");
            a3.setRent(new BigDecimal("8000.00"));
            a3.setSecurityDeposit(new BigDecimal("16000.00"));
            a3.setRoomType(RoomType.SHARED);
            a3.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a3.setGenderPreference(GenderPreference.FEMALE_ONLY);
            a3.setAvailableFrom(LocalDate.now().plusDays(3));
            a3.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a3.setModerationStatus(ModerationStatus.APPROVED);
            a3.setHouseRules("Girls only. Gate closes at 10:30 PM. Visitors allowed in common area only.");
            if (ams.size() > 4) {
                a3.setAmenities(new HashSet<>(ams.subList(0, 4)));
            }
            Accommodation savedA3 = accommodationRepository.save(a3);
            accommodationImageRepository.save(new AccommodationImage(savedA3, "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA3, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop", false));

            // 4. Modern Flat in Koramangala, Bangalore
            Accommodation a4 = new Accommodation();
            a4.setOwner(ownerRajesh);
            a4.setTitle("Modern 1BHK in Koramangala Tech Hub");
            a4.setDescription("Stylish 1BHK apartment in the heart of Bangalore's tech corridor. Close to startups, cafes, and Koramangala 4th Block market. High-speed broadband included.");
            a4.setCity("Bangalore");
            a4.setLocality("Koramangala");
            a4.setAddress("No. 221, 5th Cross, Koramangala 4th Block, Bangalore");
            a4.setRent(new BigDecimal("16000.00"));
            a4.setSecurityDeposit(new BigDecimal("48000.00"));
            a4.setRoomType(RoomType.PRIVATE);
            a4.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a4.setGenderPreference(GenderPreference.ANY);
            a4.setAvailableFrom(LocalDate.now().plusDays(7));
            a4.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a4.setModerationStatus(ModerationStatus.APPROVED);
            a4.setHouseRules("No pets. Maintain silence after 10 PM. Electricity bill shared equally.");
            if (ams.size() > 8) {
                a4.setAmenities(new HashSet<>(ams.subList(0, 8)));
            }
            Accommodation savedA4 = accommodationRepository.save(a4);
            accommodationImageRepository.save(new AccommodationImage(savedA4, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA4, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop", false));

            // 5. Budget Room in HSR Layout, Bangalore
            Accommodation a5 = new Accommodation();
            a5.setOwner(ownerSunita);
            a5.setTitle("Budget-Friendly Room in HSR Layout");
            a5.setDescription("Affordable shared room ideal for students and working professionals. Clean, spacious, and well-maintained with common kitchen access. Near HSR BDA Complex and bus stop.");
            a5.setCity("Bangalore");
            a5.setLocality("HSR Layout");
            a5.setAddress("Sector 2, HSR Layout, Bangalore");
            a5.setRent(new BigDecimal("7500.00"));
            a5.setSecurityDeposit(new BigDecimal("15000.00"));
            a5.setRoomType(RoomType.SHARED);
            a5.setFurnishingStatus(FurnishingStatus.SEMI_FURNISHED);
            a5.setGenderPreference(GenderPreference.MALE_ONLY);
            a5.setAvailableFrom(LocalDate.now().plusDays(2));
            a5.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a5.setModerationStatus(ModerationStatus.APPROVED);
            a5.setHouseRules("Smoking strictly prohibited. Keep kitchen clean after use.");
            Accommodation savedA5 = accommodationRepository.save(a5);
            accommodationImageRepository.save(new AccommodationImage(savedA5, "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&fit=crop", true));

            // 6. Spacious Flat in Bandra, Mumbai
            Accommodation a6 = new Accommodation();
            a6.setOwner(ownerRajesh);
            a6.setTitle("Sea-Facing Studio in Bandra West");
            a6.setDescription("Charming studio apartment with partial sea view near Bandstand. Premium locality with easy access to Bandra station, restaurants, and shopping. Fully furnished with modern interiors.");
            a6.setCity("Mumbai");
            a6.setLocality("Bandra West");
            a6.setAddress("Carter Road, Bandra West, Mumbai");
            a6.setRent(new BigDecimal("22000.00"));
            a6.setSecurityDeposit(new BigDecimal("66000.00"));
            a6.setRoomType(RoomType.PRIVATE);
            a6.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a6.setGenderPreference(GenderPreference.ANY);
            a6.setAvailableFrom(LocalDate.now().plusDays(15));
            a6.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a6.setModerationStatus(ModerationStatus.APPROVED);
            a6.setHouseRules("No parties. Society rules apply. Maintenance charges included.");
            if (ams.size() > 10) {
                a6.setAmenities(new HashSet<>(ams.subList(0, 10)));
            }
            Accommodation savedA6 = accommodationRepository.save(a6);
            accommodationImageRepository.save(new AccommodationImage(savedA6, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA6, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&fit=crop", false));

            // 7. PG near HITEC City, Hyderabad
            Accommodation a7 = new Accommodation();
            a7.setOwner(ownerSunita);
            a7.setTitle("Premium PG near HITEC City");
            a7.setDescription("Fully managed PG accommodation with meals, housekeeping, and high-speed WiFi. 10 minutes from major IT parks in HITEC City and Gachibowli. Ideal for tech professionals and students.");
            a7.setCity("Hyderabad");
            a7.setLocality("HITEC City");
            a7.setAddress("Plot 45, Madhapur, HITEC City, Hyderabad");
            a7.setRent(new BigDecimal("11000.00"));
            a7.setSecurityDeposit(new BigDecimal("22000.00"));
            a7.setRoomType(RoomType.SHARED);
            a7.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a7.setGenderPreference(GenderPreference.ANY);
            a7.setAvailableFrom(LocalDate.now().plusDays(4));
            a7.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a7.setModerationStatus(ModerationStatus.APPROVED);
            a7.setHouseRules("Meal timings: 8 AM, 1 PM, 8 PM. Guests not allowed overnight.");
            if (ams.size() > 7) {
                a7.setAmenities(new HashSet<>(ams.subList(0, 7)));
            }
            Accommodation savedA7 = accommodationRepository.save(a7);
            accommodationImageRepository.save(new AccommodationImage(savedA7, "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop", true));

            // 8. Affordable Room in Kothrud, Pune
            Accommodation a8 = new Accommodation();
            a8.setOwner(ownerRajesh);
            a8.setTitle("Student Room near MIT Pune");
            a8.setDescription("Clean and quiet single room perfect for students of MIT, COEP, and Symbiosis. Includes study table, wardrobe, and shared kitchen. Close to Kothrud bus depot.");
            a8.setCity("Pune");
            a8.setLocality("Kothrud");
            a8.setAddress("Lane 5, Paud Road, Kothrud, Pune");
            a8.setRent(new BigDecimal("6500.00"));
            a8.setSecurityDeposit(new BigDecimal("13000.00"));
            a8.setRoomType(RoomType.PRIVATE);
            a8.setFurnishingStatus(FurnishingStatus.SEMI_FURNISHED);
            a8.setGenderPreference(GenderPreference.MALE_ONLY);
            a8.setAvailableFrom(LocalDate.now().plusDays(8));
            a8.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a8.setModerationStatus(ModerationStatus.APPROVED);
            a8.setHouseRules("Students only. No smoking or alcohol on premises.");
            if (ams.size() > 5) {
                a8.setAmenities(new HashSet<>(ams.subList(0, 5)));
            }
            Accommodation savedA8 = accommodationRepository.save(a8);
            accommodationImageRepository.save(new AccommodationImage(savedA8, "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA8, "https://images.unsplash.com/photo-1600566753086-00f18da44096?w=800&fit=crop", false));

            // 9. Luxury Apartment in Powai, Mumbai
            Accommodation a9 = new Accommodation();
            a9.setOwner(ownerSunita);
            a9.setTitle("Lake-View 2BHK in Powai");
            a9.setDescription("Premium 2BHK apartment overlooking Powai Lake. Gated society with gym, swimming pool, and clubhouse. Near IIT Bombay and Hiranandani Gardens. Fully air-conditioned.");
            a9.setCity("Mumbai");
            a9.setLocality("Powai");
            a9.setAddress("Hiranandani Gardens, Powai, Mumbai");
            a9.setRent(new BigDecimal("25000.00"));
            a9.setSecurityDeposit(new BigDecimal("75000.00"));
            a9.setRoomType(RoomType.PRIVATE);
            a9.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            a9.setGenderPreference(GenderPreference.ANY);
            a9.setAvailableFrom(LocalDate.now().plusDays(12));
            a9.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a9.setModerationStatus(ModerationStatus.APPROVED);
            a9.setHouseRules("Society norms apply. No loud music. Parking available at extra cost.");
            if (!ams.isEmpty()) {
                a9.setAmenities(new HashSet<>(ams));
            }
            Accommodation savedA9 = accommodationRepository.save(a9);
            accommodationImageRepository.save(new AccommodationImage(savedA9, "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&fit=crop", true));
            accommodationImageRepository.save(new AccommodationImage(savedA9, "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&fit=crop", false));

            // 10. Affordable Shared Room in Ameerpet, Hyderabad
            Accommodation a10 = new Accommodation();
            a10.setOwner(ownerRajesh);
            a10.setTitle("Shared Room near Ameerpet Metro");
            a10.setDescription("Budget-friendly shared accommodation just 2 minutes from Ameerpet Metro. Ideal for coaching students and job seekers. Basic furnishing with common bathrooms and kitchen.");
            a10.setCity("Hyderabad");
            a10.setLocality("Ameerpet");
            a10.setAddress("Street 4, SR Nagar, Ameerpet, Hyderabad");
            a10.setRent(new BigDecimal("5500.00"));
            a10.setSecurityDeposit(new BigDecimal("5500.00"));
            a10.setRoomType(RoomType.SHARED);
            a10.setFurnishingStatus(FurnishingStatus.UNFURNISHED);
            a10.setGenderPreference(GenderPreference.MALE_ONLY);
            a10.setAvailableFrom(LocalDate.now().plusDays(1));
            a10.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            a10.setModerationStatus(ModerationStatus.APPROVED);
            a10.setHouseRules("Keep the room clean. Electricity charges extra. No cooking in rooms.");
            Accommodation savedA10 = accommodationRepository.save(a10);
            accommodationImageRepository.save(new AccommodationImage(savedA10, "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&fit=crop", true));

            logger.info("Initialized {} approved accommodations.", accommodationRepository.count());
        }
    }
}
