package ar.uba.fi.ingsoft1.todo_template.equipo.dtos;

import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import ar.uba.fi.ingsoft1.todo_template.user.User;

public record EquipoDTO(
    Long id,
    String teamName,
    String category,
    String mainColors,
    String secondaryColors,
    Long captainId
){
    public Equipo asEquipo(User captain) {
        return new Equipo(teamName, captain, category, mainColors, secondaryColors);
    }
}