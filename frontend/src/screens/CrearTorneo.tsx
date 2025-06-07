import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { TorneoRequestSchema, FormatoTorneoEnum } from "@/models/Torneo";
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
      formato: FormatoTorneoEnum.enum["Eliminación directa"],
      maxEquipos: 2,
    },
    validators: {
      onChange: TorneoRequestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
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
            {(field) => <field.TextField label="Fecha de inicio" type="date" />}
          </formData.AppField>

          <formData.AppField name="formato">
            {(field) => (
              <field.SelectField label="Formato del torneo">
                {FormatoTorneoEnum.options.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </field.SelectField>
            )}
          </formData.AppField>

          <formData.AppField name="maxEquipos">
            {(field) => <field.TextField label="Máximo de equipos" type="number" />}
          </formData.AppField>
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};
