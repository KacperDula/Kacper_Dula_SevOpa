package com.example.booking.repository;

import com.example.booking.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    boolean existsByNameIgnoreCase(String name);
}
