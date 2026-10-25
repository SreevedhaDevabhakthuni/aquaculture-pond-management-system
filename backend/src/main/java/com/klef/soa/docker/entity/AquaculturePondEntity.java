package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ponds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AquaculturePondEntity 
{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pondName;

    @Column(nullable = false)
    private String fishSpecies;

    @Column(nullable = false)
    private double areaAcres;

    @Column(nullable = false)
    private Boolean active;
}
