import React from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CanchaRequestSchema } from "@/models/Cancha";
import { useCrearCancha, usePoblarFranjas } from "@/services/CanchaService";
import { useLocation } from "wouter";

export const CanchaScreen = () => {
  const [, navigate] = useLocation();

  const { mutateAsync } = useCrearCancha();
  const poblarFranjas = usePoblarFranjas();
  const [loadingFranjas, setLoadingFranjas] = React.useState(false);

  const formData = useAppForm({
    defaultValues: {
      nombre: "",
      tipoCesped: "",
      iluminacion: false,
      zona: "",
      direccion: "",

      desde: "",
      hasta: "",
      horaInicio: "",
      horaFin: "",
      duracionMinutos: 60,
    },
    validators: {
      onChange: CanchaRequestSchema,
    },
    onSubmit: async ({ value }) => {
      try {

        const cancha = await mutateAsync({
          nombre: value.nombre,
          tipoCesped: value.tipoCesped,
          iluminacion: value.iluminacion,
          zona: value.zona,
          direccion: value.direccion,
        });

        if (
            cancha?.id &&
            value.desde &&
            value.hasta &&
            value.horaInicio &&
            value.horaFin &&
            value.duracionMinutos
        ) {
          setLoadingFranjas(true);
          await poblarFranjas({
            canchaId: cancha.id,
            desde: value.desde,
            hasta: value.hasta,
            horaInicio: value.horaInicio,
            horaFin: value.horaFin,
            duracionMinutos: value.duracionMinutos,
          });
          setLoadingFranjas(false);
        }

        alert("Cancha creada con éxito y franjas generadas!");
        navigate("/");
      } catch (e) {
        setLoadingFranjas(false);
        alert("Error: " + (e instanceof Error ? e.message : e));
      }
    },
  });

  return (
      <CommonLayout>
        <h1 className="text-xl font-bold mb-4">Registrar Cancha</h1>
        <formData.AppForm>
          <formData.FormContainer extraError={formData.error}>
            {}
            <formData.AppField name="nombre">
              {(field) => <field.TextField label="Nombre" />}
            </formData.AppField>
            <formData.AppField name="tipoCesped">
              {(field) => (
                  <div className="mb-2">
                    <label>Tipo de Césped</label>
                    <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="input input-bordered w-full"
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
            {}
            <div className="mt-6 border-t pt-4">
              <h2 className="font-bold mb-2">Franjas horarias</h2>
              <formData.AppField name="desde">
                {(field) => (
                    <div className="mb-2">
                      <label>Desde (fecha)</label>
                      <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full"
                      />
                    </div>
                )}
              </formData.AppField>
              <formData.AppField name="hasta">
                {(field) => (
                    <div className="mb-2">
                      <label>Hasta (fecha)</label>
                      <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full"
                      />
                    </div>
                )}
              </formData.AppField>
              <formData.AppField name="horaInicio">
                {(field) => (
                    <div className="mb-2">
                      <label>Hora inicio</label>
                      <input
                          type="time"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full"
                      />
                    </div>
                )}
              </formData.AppField>
              <formData.AppField name="horaFin">
                {(field) => (
                    <div className="mb-2">
                      <label>Hora fin</label>
                      <input
                          type="time"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full"
                      />
                    </div>
                )}
              </formData.AppField>
              <formData.AppField name="duracionMinutos">
                {(field) => (
                    <div className="mb-2">
                      <label>Duración (minutos)</label>
                      <input
                          type="number"
                          min={15}
                          step={15}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="input input-bordered w-full"
                      />
                    </div>
                )}
              </formData.AppField>
            </div>
            {loadingFranjas && <div>Generando franjas horarias...</div>}
          </formData.FormContainer>
        </formData.AppForm>
      </CommonLayout>
  );
};

export default CanchaScreen;
