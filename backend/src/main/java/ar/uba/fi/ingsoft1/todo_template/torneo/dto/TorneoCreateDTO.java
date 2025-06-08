package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ar.uba.fi.ingsoft1.todo_template.torneo.Torneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoCreateDTO(
    @NotBlank String nombre,
    @NotNull  LocalDate fechaInicio,
    @NotNull  TorneoFormato formato,
    @NotNull  Integer cantidadMaximaEquipos
) {
    public Torneo asTorneo() {
        return new Torneo(
            nombre,
            fechaInicio,
            formato,
            cantidadMaximaEquipos
        );
    }
}
