# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper files first for caching layers
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and package application
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Lightweight production JRE runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root system user for secure container execution
RUN useradd -r -u 1001 -g root roommate && \
    mkdir -p /app/uploads /app/data && \
    chown -R roommate:root /app

# Copy executable jar from build stage
COPY --from=build /app/target/roommate-backend-*.jar app.jar

USER roommate

# Default port (Render automatically provides $PORT)
ENV PORT=8080
EXPOSE 8080

# Launch application with container-aware memory allocation
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
