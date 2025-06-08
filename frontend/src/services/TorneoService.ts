import { useMutation } from "@tanstack/react-query";
import { TorneoRequest } from "@/models/Torneo";

//es de prueba, falta el back
export function crearTorneo(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (data: TorneoRequest) => {
      try {
        console.log("Torneo a crear:", data);
        options?.onSuccess?.();
        return { success: true };
      } catch (err) {
        options?.onError?.(err);
        throw err;
      }
    },
  });
}