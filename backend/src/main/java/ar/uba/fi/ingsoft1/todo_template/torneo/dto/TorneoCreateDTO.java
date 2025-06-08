package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ar.uba.fi.ingsoft1.todo_template.torneo.Torneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoCreateDTO(
    @NotBlank String name,
    @NotNull  LocalDate startDate,
    @NotNull  TorneoFormato format,
    @NotNull  Integer maxTeams,
              LocalDate endDate,
              String description,
              String prizes,
              Double registrationFee
) {
    public Torneo asTorneo() {
        return new Torneo(
            name,
            startDate,
            format,
            maxTeams,
            endDate,
            description,
            prizes,
            registrationFee
        );
    }
}
