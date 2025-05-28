import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CanchaRequestSchema } from "@/models/Cancha";
import { useCrearCancha } from "@/services/CanchaService";
import { useLocation } from "wouter";

export const CanchaScreen = () => {
  const [, navigate] = useLocation();

  const { mutate, error, isPending } = useCrearCancha({
    onSuccess: () => {
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
      //fotos: undefined,
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
                  value={field.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="pasto">Césped</option>
                  <option value="sintetico">Sintético</option>
                </select>
              </div>
            )}
          </formData.AppField>

            {/*no se porque no aparece el tick de iluminacion, pero funciona */}
          <formData.AppField name="iluminacion">
            {(field) => (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <label>Iluminación</label>
              </div>
            )}
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
