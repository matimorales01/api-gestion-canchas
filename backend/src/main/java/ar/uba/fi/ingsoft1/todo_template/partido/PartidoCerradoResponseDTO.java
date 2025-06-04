package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoCerradoResponseDTO(
    Long idPartido,
    LocalDate fechaPartido,
    LocalTime horaPartido,
    Long nroCancha,
    String equipo1,
    String equipo2,
    Long organizadorId,
    String emailOrganizador

) {
    public static PartidoCerradoResponseDTO fromEntity(PartidoCerrado partido){
        return new PartidoCerradoResponseDTO(
            partido.getIdPartido(),
            partido.getFechaPartido(),
            partido.getHoraPartido(),
            partido.getNroCancha(),
            partido.getEquipo1(),
            partido.getEquipo2(),
            partido.getOrganizador().getId(),
            partido.getOrganizador().getEmail()
            );

    }

    
}

