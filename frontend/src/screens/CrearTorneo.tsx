import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { TorneoRequestSchema } from "@/models/Torneo";
import { useLocation } from "wouter";
import { crearTorneo } from "@/services/TorneoService";

export const CrearTorneo = () => {
  const [, navigate] = useLocation();

  const { mutate, error } = crearTorneo({
    onSuccess: () => {
      alert("¡Torneo creado con éxito!");
      navigate("/");
    },
  });

  const formData = useAppForm({
    defaultValues: {
      nombre: "",
      fechaInicio: "",
      formato: "ELIMINACION_DIRECTA",
      maxEquipos: 2,
      fechaFin: "",
      descripcion: "",
      premios: "",
      costoInscripcion: 0,
    },
    validators: {
      onChange: TorneoRequestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        nombre: value.nombre,
        fechaInicio: value.fechaInicio,
        formato: value.formato,
        cantidadMaximaEquipos: value.maxEquipos,
        fechaFin: value.fechaFin || null,
        descripcion: value.descripcion || null,
        premios: value.premios || null,
        costoInscripcion: value.costoInscripcion || null,
      });
    },
  });

  return (
    <CommonLayout>
      <h1 className="text-xl font-bold mb-4">Crear Torneo</h1>
      <formData.AppForm>
        <formData.FormContainer extraError={error}>

          <formData.AppField name="nombre">
            {(field) => <field.TextField label="Nombre del Torneo" />}
          </formData.AppField>

          <formData.AppField name="fechaInicio">
            {(field) => (
              <div className="mb-2">
                <label>Fecha de inicio</label>
                <input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="fechaFin">
            {(field) => (
              <div className="mb-2">
                <label>Fecha de fin (opcional)</label>
                <input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="maxEquipos">
            {(field) => (
              <div className="mb-2">
                <label>Máximo de Equipos</label>
                <input
                  type="number"
                  min={2}
                  step={1}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="formato">
            {(field) => (
              <div className="mb-2">
                <label>Formato del torneo</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input input-bordered w-full"
                >
                  <option value="ELIMINACION_DIRECTA">Eliminacion Directa</option>
                  <option value="FASE_GRUPOS_ELIMINACION">Fase de Grupos y Eliminacion Directa</option>
                  <option value="LIGA">Liga</option>
                </select>
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="descripcion">
            {(field) => (
              <div className="mb-2">
                <label>Descripción (opcional)</label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="premios">
            {(field) => (
              <div className="mb-2">
                <label>Premios (opcional)</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="costoInscripcion">
            {(field) => (
              <div className="mb-2">
                <label>Costo de Inscripción (opcional)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </formData.AppField>

        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};
