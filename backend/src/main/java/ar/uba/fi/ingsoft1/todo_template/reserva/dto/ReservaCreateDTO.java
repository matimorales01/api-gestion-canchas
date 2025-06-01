// backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/dto/ReservaCreateDTO.java
package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaCreateDTO(
    @NotNull Long canchaId,
    @NotNull LocalDate fecha,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFin
) {}
