package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoDTO(
    Long id,
    String nombre,
    LocalDate fechaInicio,
    TorneoFormato formato,
    Integer cantidadMaximaEquipos
) {}
