package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import jakarta.validation.constraints.NotNull;

public record PartidoAbiertoCreateDTO(
    @NotNull Long nroCancha,
    @NotNull String fechaPartido,
    @NotNull String horaPartido,
    @NotNull Integer minJugadores,
    @NotNull Integer maxJugadores,
    //@NotNull String emailOrganizador
    @NotNull Long idOrganizador
){}