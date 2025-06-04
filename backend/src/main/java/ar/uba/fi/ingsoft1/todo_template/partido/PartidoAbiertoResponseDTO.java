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
        Integer cuposDisponibles,
        Long organizadorId,
        String emailOrganizador,
        boolean inscripto
) {
    public static PartidoAbiertoResponseDTO fromEntity(PartidoAbierto partido, Long usuarioLogueadoId){
        boolean inscripto = partido.getJugadores().stream()
                .anyMatch(j -> j.getId().equals(usuarioLogueadoId));
        return new PartidoAbiertoResponseDTO(
                partido.getIdPartido(),
                partido.getNroCancha(),
                partido.getFechaPartido(),
                partido.getHoraPartido(),
                partido.getMinJugadores(),
                partido.getMaxJugadores(),
                partido.getCuposDisponibles(),
                partido.getOrganizador().getId(),
                partido.getOrganizador().getEmail(),
                inscripto
        );
    }
}
