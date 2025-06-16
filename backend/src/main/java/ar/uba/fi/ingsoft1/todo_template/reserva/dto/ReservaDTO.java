package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaDTO(
        Long canchaId,
        String canchaName,
        String zona,
        String direccion,
        LocalDate fecha,
        LocalTime inicioTurno,
        LocalTime finTurno,
        String state,
        String tipoPartido
)  {}
