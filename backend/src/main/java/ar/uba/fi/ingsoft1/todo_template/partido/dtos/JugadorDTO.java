package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import ar.uba.fi.ingsoft1.todo_template.user.User;

public record JugadorDTO(Long id, String nombre, String email) {
    public static JugadorDTO fromEntity(User usuario) {
        return new JugadorDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail()
        );
    }
}
