package ar.uba.fi.ingsoft1.todo_template.partido;

public record PartidoResponseDTO(
    Long idPartido,
    String tipoPartido,
    Long nroCancha,
    String fechaPartido,
    String horaPartido,
    Long organizadorId,
    String emailOrganizador
    

) {
    public static PartidoResponseDTO fromEntity(Partido partido){

        return new PartidoResponseDTO(
            partido.getIdPartido(),
            partido.getTipoPartido(),
            partido.getNroCancha(),
            partido.getFechaPartido(),
            partido.getHoraPartido(),
            partido.getOrganizador().getId(),
            partido.getOrganizador().getEmail()
            

        );
    }

}
