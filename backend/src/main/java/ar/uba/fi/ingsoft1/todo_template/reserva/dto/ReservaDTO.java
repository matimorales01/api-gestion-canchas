package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaDTO(
    String canchaName,
    LocalDate fecha,
    LocalTime inicioTurno,
    LocalTime finTurno,
    String state,
    String tipoPartido
) {}
