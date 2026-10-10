package com.roommate.dto.matching;

public class MatchFactorDetail {
    private String factorName;
    private double weightPercentage;
    private double score; // 0 to 100
    private String description;
    private boolean matched;

    public MatchFactorDetail() {}

    public MatchFactorDetail(String factorName, double weightPercentage, double score, String description, boolean matched) {
        this.factorName = factorName;
        this.weightPercentage = weightPercentage;
        this.score = score;
        this.description = description;
        this.matched = matched;
    }

    public String getFactorName() { return factorName; }
    public void setFactorName(String factorName) { this.factorName = factorName; }

    public double getWeightPercentage() { return weightPercentage; }
    public void setWeightPercentage(double weightPercentage) { this.weightPercentage = weightPercentage; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isMatched() { return matched; }
    public void setMatched(boolean matched) { this.matched = matched; }
}
