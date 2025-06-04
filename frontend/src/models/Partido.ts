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


export const CrearPartidoSchema = z.object({
  nroCancha: z.string().min(1, "La cancha no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  horaPartido: z.string().min(1, "La franja horaria es obligatoria"),
  minJugadores: z.string().min(1, "Los jugadores mínimos no puede estar vacío").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  maxJugadores: z.string().min(1, "Los jugadores máximos no puede estar vacío").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
});

export const CrearPartidoCerradoSchema = z.object({
  cancha: z.string().min(1, "Seleccione una cancha"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  franjaHoraria: z.string().min(1, "La franja horaria es obligatoria"),
  equipo1: z.string().min(1, "Debe ingresar al equipo A"),
  equipo2: z.string().min(1, "Debe ingresar al equipo B"),
});

export type PartidoRequest = z.infer<typeof CrearPartidoSchema>;
