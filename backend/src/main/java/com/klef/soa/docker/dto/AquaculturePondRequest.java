
package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AquaculturePondRequest 
{
    @NotBlank(message = "Pond name is required")
    private String pondName;

    @NotBlank(message = "Fish species is required")
    private String fishSpecies;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than zero")
    private Double areaAcres;

    @NotNull(message = "Active status is required")
    private Boolean active;
}
