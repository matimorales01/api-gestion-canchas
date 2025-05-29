import { z } from "zod";

export const CanchaRequestSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    tipoCesped: z.enum(["Sintetico", "Natural"], {
        errorMap: () => ({ message: "Debes elegir entre sintético o natural" }),
    }),
    iluminacion: z.boolean().default(false),
    zona: z.string().min(1, "La zona es obligatoria"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
});

export type CanchaRequest = z.infer<typeof CanchaRequestSchema>;

export interface Cancha extends CanchaRequest {
    id: number;
    activa?: boolean;
}

export interface CanchaEditRequest extends Partial<CanchaRequest> {
    activa?: boolean;
}
