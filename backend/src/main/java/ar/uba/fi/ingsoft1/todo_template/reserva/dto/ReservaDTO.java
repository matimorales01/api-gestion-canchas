package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;

public record ReservaDTO(
        Long canchaId,
        String canchaName,
        String zona,
        String direccion,
        LocalDate fecha,
        LocalTime inicioTurno,
        LocalTime finTurno,
        TipoPartido tipoPartido,
        String emailOrganizador
)  {}
