package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import java.time.LocalDate;
import java.time.LocalTime;



public record PartidoCreateDTO(
        Long idPartido,
        String tipoPartido,
        Long canchaId,
        LocalDate fechaPartido,
        LocalTime horaPartido,
        //para abierto
        Integer minJugadores,
        Integer maxJugadores,
        //para cerrado
        String equipo1,
        String equipo2

        
        
) { }