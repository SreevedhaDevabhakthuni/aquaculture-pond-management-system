
package com.klef.soa.docker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AquaculturePondResponse 
{
    private Long id;
    private String pondName;
    private String fishSpecies;
    private Double areaAcres;
    private Boolean active;
}
