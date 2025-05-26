import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username must not be empty"),
  password: z.string().min(1, "Password must not be empty"),
  email: z.string().min(1, "email must not be empty").email("El email no es válido"),
  genero: z.string().min(1, "genero must not be empty"),
  edad: z.string().min(1, "edad must not be empty").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  zona: z.string().min(1, "zona must not be empty"),
  foto: z.any().refine((file) => file instanceof File && file.size > 0, {message: "La foto no puede estar vacía",
}),

});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
