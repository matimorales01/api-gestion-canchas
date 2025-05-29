import { z } from "zod";

export const CrearPartidoSchema = z.object({
  cancha:z.string().min(1, "los cupos no puede estar vacía"),
  franjaHoraria: z.string().min(1, "La franja horaria es obligatoria"),
  jugadoresMinimos: z.string().min(1, "Los jugadores Minimos  no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  jugadoresMaximos: z.string().min(1, "Los juagdores maximos no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  fecha: z.string().min(1, "La fecha es obligatoria"), // Si usás strings para fecha
  horario: z.string().min(1, "El horario es obligatorio"), // También puede ser hora tipo string
  cupos: z.string().min(1, "los cupos no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
});
