package ar.uba.fi.ingsoft1.todo_template.partido.dtos;


public record PartidoCreateDTO(
        Long idPartido,
        String tipoPartido,
        Long nroCancha,
        String fechaPartido,
        String horaPartido,
        int cantJugadoresActuales

        
        
) { }