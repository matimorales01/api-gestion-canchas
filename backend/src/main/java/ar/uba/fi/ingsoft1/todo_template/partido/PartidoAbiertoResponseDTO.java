package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoAbiertoResponseDTO(
    Long idPartido,    
    Long nroCancha,
    LocalDate fechaPartido,
    LocalTime horaPartido,
    Integer minJugador,
    Integer maxJugador,
    //Integer plazasDisponibles (falta la parte de inscripcion)
    Long organizadorId,
    String emailOrganizador
) {
    public static PartidoAbiertoResponseDTO fromEntity(PartidoAbierto partido){
        return new PartidoAbiertoResponseDTO(
            partido.getIdPartido(),
            partido.getNroCancha(),
            partido.getFechaPartido(),
            partido.getHoraPartido(),
            partido.getMinJugadores(),
            partido.getMaxJugadores(),
            partido.getOrganizador().getId(),
            partido.getOrganizador().getEmail()
        );
    }
} 



