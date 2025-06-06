package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.reserva.State;

public record ReservaDTO(
    Long id,
    Long canchaId,
    State state,
    Long usuarioCanchaId,
    String partido,
    LocalDate fecha,
    LocalTime inicioTurno,
    LocalTime finTurno
) {
}
