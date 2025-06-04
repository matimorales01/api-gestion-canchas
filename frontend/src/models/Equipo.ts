import { z } from "zod";

export const EquipoRequestSchema = z.object({
    teamName: z.string().min(1, "El nombre del equipo no puede estar vacío"),
    category: z.string().optional(),
    mainColors: z.string().optional(),
    secondaryColors: z.string().optional(),
})