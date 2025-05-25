import { z } from "zod";
// para campos vacios 
export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username must not be empty"),
  password: z.string().min(1, "Password must not be empty"),
  email: z.string().min(1, "email must not be empty").email("El email no es válido"),
  genero: z.string().min(1, "genero must not be empty"),
  edad: z.string().min(1, "edad must not be empty"),
  zona: z.string().min(1, "zona must not be empty"),
  foto:z
  .any()
  .refine((file) => file instanceof File, "Foto debe ser un archivo"),
});
//
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
