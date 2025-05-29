package ar.uba.fi.ingsoft1.todo_template.partido;

public record PartidoCerradoResponseDTO(
    Long idPartido,
    String fechaPartido,
    String horaPartido,
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

