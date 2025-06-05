package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoCerradoResponseDTO(
        Long idPartido,
        String canchaNombre,
        String canchaDireccion,
        LocalDate fechaPartido,
        LocalTime horaPartido,
        String equipo1,
        String equipo2,
        Long organizadorId,
        String emailOrganizador
) {
    public static PartidoCerradoResponseDTO fromEntity(PartidoCerrado partido){
        return new PartidoCerradoResponseDTO(
                partido.getIdPartido(),
                partido.getCancha().getNombre(),
                partido.getCancha().getDireccion(),
                partido.getFechaPartido(),
                partido.getHoraPartido(),
                partido.getEquipo1(),
                partido.getEquipo2(),
                partido.getOrganizador().getId(),
                partido.getOrganizador().getEmail()
        );
    }
}
