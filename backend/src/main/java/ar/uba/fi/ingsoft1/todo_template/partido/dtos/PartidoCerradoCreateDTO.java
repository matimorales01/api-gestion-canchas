package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PartidoCerradoCreateDTO(
    @NotNull Long nroCancha,
    @NotNull String fechaPartido,
    @NotNull String horaPartido,
    @NotBlank String equipo1,
    @NotBlank String equipo2,
    //@NotNull String emailOrganizador
    @NotNull Long idOrganizador
){}