package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.EstadoTorneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoDTO(
    Long id,
    String nombre,
    LocalDate fechaInicio,
    LocalDate fechaFin,
    TorneoFormato formato,
    Integer cantidadMaximaEquipos,
    String descripcion,
    String premios,
    Double costoInscripcion,
    EstadoTorneo estado,
    Long organizadorId
) {}
