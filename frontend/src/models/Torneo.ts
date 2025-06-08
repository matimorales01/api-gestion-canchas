import { z } from "zod";

export const FormatoTorneoEnum = z.enum([
  "Eliminación directa",
  "Fase de grupos y luego eliminación",
  "Liga todos contra todos",
]);

export const TorneoRequestSchema = z.object({
  nombre: z.string().min(1, "El nombre del torneo es obligatorio"),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  formato: FormatoTorneoEnum,
  maxEquipos: z.number().int().positive("Debe ser un número mayor a 0"),

  fechaFin: z.string().optional(),
  descripcion: z.string().optional(),
  premios: z.string().optional(),
  costoInscripcion: z.number().nonnegative("Debe ser mayor o igual a 0").optional(),
});

export type TorneoRequest = z.infer<typeof TorneoRequestSchema>;

export interface Torneo extends TorneoRequest {
  id: number;
  estado: "Abierto" | "Cerrado" | "En curso" | "Finalizado";
  creadorId: number;
}

export interface TorneoEditRequest extends Partial<TorneoRequest> {}
