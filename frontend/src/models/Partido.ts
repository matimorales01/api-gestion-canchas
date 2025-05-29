import { z } from "zod";

export const CrearPartidoSchema = z.object({
  cancha: z.string().min(1, "La cancha no puede estar vacía"),
  franjaHoraria: z.string().min(1, "La franja horaria es obligatoria"),
  jugadoresMinimos: z.number({ invalid_type_error: "Debe ser un número" }).min(1, "Debe haber al menos un jugador mínimo"),
  jugadoresMaximos: z.number({ invalid_type_error: "Debe ser un número" }).min(1, "Debe haber al menos un jugador máximo")
    .refine((max) => max >= 1, "Debe ser mayor o igual a 1"),
  fecha: z.string().min(1, "La fecha es obligatoria"), // Si usás strings para fecha
  horario: z.string().min(1, "El horario es obligatorio"), // También puede ser hora tipo string
  canchaConfirmacion: z.string().min(1, "Confirmación de cancha requerida"), // o podrías usar z.boolean() si es un check
  cupos: z.number({ invalid_type_error: "Debe ser un número" }).min(1, "Debe haber al menos 1 cupo disponible"),
});
