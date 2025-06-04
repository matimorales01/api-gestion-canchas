import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CanchaRequestSchema } from "@/models/Cancha";
import { useCrearCancha } from "@/services/CanchaService";
import { useLocation } from "wouter";

export const CanchaScreen = () => {
  const [, navigate] = useLocation();

  const { mutate, error, } = useCrearCancha({
    onSuccess: () => {
      alert("Cancha creada con exito!");
      navigate("/");
    },
  });

  const formData = useAppForm({
    defaultValues: {
      nombre: "",
      tipoCesped: "",
      iluminacion: false,
      zona: "",
      direccion: "",

    },
    validators: {
      onChange: CanchaRequestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

return (
    <CommonLayout>
      <h1 className="text-xl font-bold mb-4">Registrar Cancha</h1>

      <formData.AppForm>
        <formData.FormContainer extraError={error}>
          <formData.AppField name="nombre">
            {(field) => <field.TextField label="Nombre" />}
          </formData.AppField>

          <formData.AppField name="tipoCesped">
            {(field) => (
              <div>
                <label>Tipo de Césped</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="Natural">Natural</option>
                  <option value="Sintetico">Sintético</option>
                </select>
              </div>
            )}
          </formData.AppField>

          <formData.AppField name="iluminacion">
            {(field) => <field.CheckboxField />}
          </formData.AppField>

          <formData.AppField name="zona">
            {(field) => <field.TextField label="Zona" />}
          </formData.AppField>

          <formData.AppField name="direccion">
            {(field) => <field.TextField label="Dirección" />}
          </formData.AppField>

        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};
