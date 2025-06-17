import { z } from "zod";

export const EquipoRequestSchema = z.object({
    teamName: z.string().min(1, "El nombre es requerido"),
    category: z.string(),
    mainColors: z.string(),
    secondaryColors: z.string(),
});