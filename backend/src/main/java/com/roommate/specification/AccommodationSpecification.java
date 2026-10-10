package com.roommate.specification;

import com.roommate.dto.accommodation.AccommodationSearchFilter;
import com.roommate.entity.Accommodation;
import com.roommate.enums.AvailabilityStatus;
import com.roommate.enums.ModerationStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AccommodationSpecification {

    public static Specification<Accommodation> filter(AccommodationSearchFilter filter, boolean publicOnly) {
        return (Root<Accommodation> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (publicOnly) {
                predicates.add(cb.equal(root.get("moderationStatus"), ModerationStatus.APPROVED));
                predicates.add(cb.equal(root.get("availabilityStatus"), AvailabilityStatus.AVAILABLE));
            }

            if (filter.getQuery() != null && !filter.getQuery().trim().isEmpty()) {
                String searchLike = "%" + filter.getQuery().trim().toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), searchLike);
                Predicate descPred = cb.like(cb.lower(root.get("description")), searchLike);
                Predicate cityPred = cb.like(cb.lower(root.get("city")), searchLike);
                Predicate locPred = cb.like(cb.lower(root.get("locality")), searchLike);
                predicates.add(cb.or(titlePred, descPred, cityPred, locPred));
            }

            if (filter.getCity() != null && !filter.getCity().trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), filter.getCity().trim().toLowerCase()));
            }

            if (filter.getLocality() != null && !filter.getLocality().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("locality")), "%" + filter.getLocality().trim().toLowerCase() + "%"));
            }

            if (filter.getMinRent() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rent"), filter.getMinRent()));
            }

            if (filter.getMaxRent() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rent"), filter.getMaxRent()));
            }

            if (filter.getRoomType() != null) {
                predicates.add(cb.equal(root.get("roomType"), filter.getRoomType()));
            }

            if (filter.getFurnishingStatus() != null) {
                predicates.add(cb.equal(root.get("furnishingStatus"), filter.getFurnishingStatus()));
            }

            if (filter.getGenderPreference() != null) {
                predicates.add(cb.equal(root.get("genderPreference"), filter.getGenderPreference()));
            }

            if (filter.getAmenityIds() != null && !filter.getAmenityIds().isEmpty()) {
                query.distinct(true);
                Join<Object, Object> amenitiesJoin = root.join("amenities", JoinType.INNER);
                predicates.add(amenitiesJoin.get("id").in(filter.getAmenityIds()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
