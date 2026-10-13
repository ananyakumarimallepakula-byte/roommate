# Stage 1: Build Spring Boot backend from repo root
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy root Maven wrapper and POM configurations
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY backend/pom.xml ./backend/pom.xml

RUN chmod +x mvnw && ./mvnw -f backend/pom.xml dependency:go-offline -B || true

# Copy backend source code and build executable jar
COPY backend/src ./backend/src
RUN ./mvnw -f backend/pom.xml clean package -DskipTests -B

# Stage 2: Production JRE runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN useradd -r -u 1001 -g root roommate && \
    mkdir -p /app/uploads /app/data && \
    chown -R roommate:root /app

COPY --from=build /app/backend/target/roommate-backend-*.jar app.jar

USER roommate

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=""
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar app.jar"]
