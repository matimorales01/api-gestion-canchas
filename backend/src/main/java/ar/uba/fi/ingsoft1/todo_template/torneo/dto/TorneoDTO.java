package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.EstadoTorneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoDTO(
    Long id,
    String name,
    LocalDate startDate,
    LocalDate endDate,
    TorneoFormato format,
    Integer maxTeams,
    String description,
    String prizes,
    Double registrationFee,
    EstadoTorneo state,
    Long organizerId
) {}
