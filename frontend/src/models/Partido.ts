import { z } from "zod";

export interface Partido {
  idPartido: number;
  nroCancha: number;
  fechaPartido: string;
  horaPartido: string;
  cuposDisponibles: number;
  emailOrganizador: string;
  inscripto: boolean;
  partidoConfirmado: boolean;
}
/**
public record PartidoAbiertoCreateDTO(


    @NotNull Long canchaId,
    @NotNull LocalDate fechaPartido,
    @NotNull LocalTime horaPartido,
    @NotNull Integer minJugadores,
    @NotNull Integer maxJugadores,
    @NotNull Integer cuposDisponibles) 
   
    // crear partido cerrado
      @NotNull Long canchaId,
    @NotNull LocalDate fechaPartido,
    @NotNull LocalTime horaPartido,
    @NotBlank String equipo1,
    @NotBlank String equipo2
    
    //reservas
        @NotNull Long canchaId,
    @NotNull LocalDate fecha,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFin*/

export const CrearPartidoAbiertoSchema = z.object({
  canchaId: z.string().min(1, "La cancha es obligatoria"),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
  horaInicio:z.string().optional(),
  horaFin:z.string().optional(),
  minJugadores: z.string().min(1, "Jugadores mínimos es obligatorio"),
  maxJugadores: z.string().min(1, "Jugadores máximos es obligatorio"),
  cuposDisponibles: z.string().min(1, "Cupos disponibles es obligatorio"),
  equipo1: z.string().optional(),
  equipo2: z.string().optional(),
});

export const CrearPartidoCerradoSchema = z.object({
  canchaId: z.string().min(1, "La cancha es obligatoria"),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
  horaPartido: z.string().min(1, "La hora es obligatoria"),
  horaInicio:z.string().optional(),
  horaFin: z.string().optional(),
  minJugadores: z.string().optional(),
  maxJugadores: z.string().optional(),
  cuposDisponibles: z.string().optional(),
  equipo1: z.string().min(1, "Equipo 1 es obligatorio"),
  equipo2: z.string().min(1, "Equipo 2 es obligatorio"),
});

export type PartidoRequest = z.infer<typeof CrearPartidoAbiertoSchema>;
export type PartidoCerradoRequest = z.infer<typeof CrearPartidoCerradoSchema>;
