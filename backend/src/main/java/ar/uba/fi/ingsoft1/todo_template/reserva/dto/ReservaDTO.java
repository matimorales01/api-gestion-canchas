package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.reserva.State;

public record ReservaDTO(
    String canchaName,
    State state,
    String tipoPartido,
    LocalDate fecha,
    LocalTime inicioTurno,
    LocalTime finTurno
) {}
