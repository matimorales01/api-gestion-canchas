import { z } from "zod";


export const CrearPartidoSchema = z.object({
  nroCancha:z.string().min(1, "los cupos no puede estar vacía"),
  horaPartido: z.string().min(1, "La franja horaria es obligatoria"),
  minJugadores: z.string().min(1, "Los jugadores Minimos  no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  maxJugadores: z.string().min(1, "Los juagdores maximos no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
});


export const CrearPartidoCerradoSchema = z.object({
  cancha:z.string().min(1, "Seleccione una cancha"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  franjaHoraria: z.string().min(1, "La franja horaria es obligatoria"),
  equipo1: z.string().min(1, "Debe ingresar al equipo A"),
  equipo2: z.string().min(1, "Debe ingresar al equipo B"),
});
export type PartidoRequest = z.infer<typeof CrearPartidoSchema>;

export interface Partido extends PartidoRequest {
  id: number;
}

