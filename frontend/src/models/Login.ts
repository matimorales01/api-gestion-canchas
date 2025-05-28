import { z } from "zod";

export const LoginRequestSchema = z.object({
  password: z.string().min(1, "Password must not be empty"),
  email: z.string().min(1, "email must not be empty").email("El email no es válido"),
});


export const SignupSchema = z.object({
  username: z.string().min(1, "El usuario no puede estar vacío"),
  firstName: z.string().min(1, "El nombre no puede estar vacío"),
  lastName: z.string().min(1, "El apellido no puede estar vacío"),
  password: z.string().min(1, "La contraseña no puede estar vacía"),
  email: z.string().min(1, "El email no puede estar vacío").email("El email no es válido"),
  genre: z.string().min(1, "El género no puede estar vacío"),
  age: z.string().min(1, "La edad no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  zone: z.string().min(1, "La zona no puede estar vacía"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
