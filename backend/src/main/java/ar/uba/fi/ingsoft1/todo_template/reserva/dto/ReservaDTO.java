package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaDTO(
    Long id,
    Long canchaId,
    LocalDate fecha,
    LocalTime horaInicio,
    LocalTime horaFin
) {
}
