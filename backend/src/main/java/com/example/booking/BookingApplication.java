package com.example.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // turn on automatic createdAt/updatedAt handling for our entities
public class BookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingApplication.class, args); // fire up the API and supporting beans
    }
}
