import { z } from "zod";

export const CanchaRequestSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),

    tipoCesped: z.enum(["sintetico", "pasto"], {
        errorMap: () => ({ message: "Debes elegir entre sintético o pasto" }),
    }),

    iluminacion: z.boolean().default(false),

    zona: z.string().min(1, "La zona es obligatoria"),

    direccion: z.string().min(1, "La dirección es obligatoria"),
});

export type CanchaRequest = z.infer<typeof CanchaRequestSchema>;