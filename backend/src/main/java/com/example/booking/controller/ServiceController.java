package com.example.booking.controller;

import com.example.booking.dto.ServiceDto;
import com.example.booking.dto.ServiceRequest;
import com.example.booking.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services")
@SecurityRequirement(name = "bearerAuth")
public class ServiceController {

    // Admin-facing CRUD endpoints plus the public listing call used on the landing page

    private final ServiceCatalogService serviceCatalogService;

    public ServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    @Operation(summary = "List all services")
    public ResponseEntity<List<ServiceDto>> list() { // exposed without auth so prospects can browse offerings
        return ResponseEntity.ok(serviceCatalogService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a service by id")
    public ResponseEntity<ServiceDto> get(@PathVariable Long id) { // individual detail lookup, also public
        return ResponseEntity.ok(serviceCatalogService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new service")
    public ResponseEntity<ServiceDto> create(@Valid @RequestBody ServiceRequest request) { // admins can add new services through the dashboard
        return new ResponseEntity<>(serviceCatalogService.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing service")
    public ResponseEntity<ServiceDto> update(@PathVariable Long id, @Valid @RequestBody ServiceRequest request) { // same validation payload handles updates
        return ResponseEntity.ok(serviceCatalogService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a service")
    public ResponseEntity<Void> delete(@PathVariable Long id) { // soft requirements meant this can stay a hard delete for now
        serviceCatalogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
