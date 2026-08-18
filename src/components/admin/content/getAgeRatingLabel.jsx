export default function getAgeRatingLabel(ageRating) {
    const ageRatingLabels = {
        ALL: '전체 관람가',
        AGE_12: '12세 이상',
        AGE_15: '15세 이상',
        AGE_19: '청소년 관람불가',
    };

    return ageRatingLabels[ageRating] ?? ageRating;
}