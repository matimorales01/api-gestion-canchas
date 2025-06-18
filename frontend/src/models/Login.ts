import { z } from "zod";

export const LoginRequestSchema = z.object({
  password: z.string().min(1, "La contraseña no puede estar vacia"),
  email: z.string().min(1, "El email no puede estar vacio"),
});


export const SignupSchema = z.object({
  username: z.string().min(1, "El usuario no puede estar vacío"),
  firstName: z.string().min(1, "El nombre no puede estar vacío"),
  lastName: z.string().min(1, "El apellido no puede estar vacío"),
  password: z.string().min(1, "La contraseña no puede estar vacía"),
  email: z.string().min(1, "El email no puede estar vacío"),
  genre: z.string().min(1, "El género no puede estar vacío"),
  age: z.string().min(1, "La edad no puede estar vacía").refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" }),
  zone: z.string().min(1, "La zona no puede estar vacía"),
  rol: z.enum(["JUGADOR", "ORGANIZADOR", "ADMINISTRADOR"], {
    required_error: "El rol es obligatorio",
    invalid_type_error: "Rol inválido"
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
