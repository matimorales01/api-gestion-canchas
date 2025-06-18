import React from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CanchaRequestSchema } from "@/models/Cancha";
import { useCrearCancha, usePoblarFranjas, useCanchas, useEliminarCancha } from "@/services/CanchaService";
import { useLocation } from "wouter";
import ToggleSwitch from "../components/form-components/Switch/ToggleSwitch.tsx";
import styles from "../styles/CanchasScreen.module.css";
import type { Cancha } from "@/models/Cancha";

export const CanchaScreen: React.FC = () => {
  const [, navigate] = useLocation();
  const { data: canchas, isLoading, isError, refetch } = useCanchas();
  const eliminarCancha = useEliminarCancha({
    onSuccess: () => {
      alert("Cancha eliminada correctamente");
      refetch && refetch();
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "message" in error) {
        alert("Error al eliminar cancha: " + (error as { message: string }).message);
      } else {
        alert("Error al eliminar cancha");
      }
    },
  });

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
    onSubmit: async ({ value }: any) => {
      if (value.desde && value.hasta && value.hasta < value.desde) {
        alert("La fecha 'Hasta' no puede ser menor que 'Desde'");
        return;
      }
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
          await poblarFranjas.mutateAsync({
            canchaId: cancha.id,
            fechaInicial: value.desde,
            fechaFinal: value.hasta,
            horarioInicio: value.horaInicio,
            horarioFin: value.horaFin,
            minutos: value.duracionMinutos,
          });
          setLoadingFranjas(false);
        }

        alert("Cancha creada con éxito y franjas generadas!");

        if (formData.reset) formData.reset();
        else if (formData.setValues) formData.setValues({
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
        });

        refetch && refetch();

      } catch (e: any) {
        setLoadingFranjas(false);
        alert("Error: " + (e instanceof Error ? e.message : e));
      }
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que querés eliminar la cancha?")) {
      eliminarCancha.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/canchas/${id}`);
  };

  const handleAgregarFranja = (id: number) => {
    navigate(`/admin/canchas/${id}/franjas`);
  };

  return (
      <CommonLayout>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Mis Canchas</h1>
          {isLoading && <p>Cargando canchas...</p>}
          {isError && <p>Error al cargar las canchas</p>}
          {!isLoading && !isError && canchas && (
              <div className={styles.canchasGrid}>
                {(canchas as Cancha[]).map((cancha) => (
                    <div key={cancha.id} className={`${styles.canchaCard} ${styles.canchaCardHorizontal}`}>
                      <div className={styles.canchaInfo}>
                        <strong> {cancha.nombre}</strong>
                        <span>  |  Dirección: {cancha.direccion}</span>
                        <span>  |  Césped: {cancha.tipoCesped}</span>
                        <span>  |  Zona: {cancha.zona}</span>
                        <span>  |  Iluminación: {cancha.iluminacion ? "Sí" : "No"}</span>
                        <span>  |  Estado: {cancha.activa ? "Activa" : "Inactiva"}</span>
                      </div>
                      <div className={styles.buttonRow}>
                        <button
                            className={`${styles.button} ${styles.editButton}`}
                            onClick={() => handleEdit(cancha.id)}
                        >
                          Editar
                        </button>
                        <button
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={() => handleDelete(cancha.id)}
                            disabled={eliminarCancha.isPending}
                        >
                          {eliminarCancha.isPending ? "Eliminando..." : "Eliminar"}
                        </button>
                        <button
                            className={`${styles.button} ${styles.agregarButton}`}
                            onClick={() => handleAgregarFranja(cancha.id)}
                        >
                          Agregar franja horaria
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
          <div className={styles.formBox}>
            <h1 className={styles.title}>Registrar cancha</h1>
            <p className={styles.subtitle}>
              Completá los datos de la cancha y generá las franjas horarias.
            </p>
            <formData.AppForm>
              <formData.FormContainer extraError={formData.error}>
                <h2 className={styles.sectionTitle}>Datos de la cancha</h2>
                <div className={styles.fieldsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre</label>
                    <formData.AppField name="nombre">
                      {(field: any) => (
                          <>
                            <field.TextField className={styles.input} />
                            <div className={styles.inputError}>{field.state.meta?.error}</div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Zona</label>
                    <formData.AppField name="zona">
                      {(field: any) => (
                          <>
                            <field.TextField className={styles.input} />
                            <div className={styles.inputError}>{field.state.meta?.error}</div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Tipo de Césped</label>
                    <formData.AppField name="tipoCesped">
                      {(field: any) => (
                          <>
                            <select
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={styles.input}
                            >
                              <option value="">Seleccionar</option>
                              <option value="Natural">Natural</option>
                              <option value="Sintetico">Sintético</option>
                            </select>
                            <div className={styles.inputError}>{field.state.meta?.error}</div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Dirección</label>
                    <formData.AppField name="direccion">
                      {(field: any) => (
                          <>
                            <field.TextField className={styles.input} />
                            <div className={styles.inputError}>{field.state.meta?.error}</div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <formData.AppField name="iluminacion">
                      {(field: any) => (
                          <>
                            <ToggleSwitch
                                checked={field.state.value}
                                onChange={field.handleChange}
                                label="Iluminación"
                            />
                            <div className={styles.inputError}>{field.state.meta?.error}</div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                </div>
                <div className={styles.sectionDivider}></div>
                <h2 className={styles.sectionTitle}>Franjas horarias</h2>
                <div className={styles.franjasGrid}>
                  <formData.AppField name="desde">
                    {(field: any) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Desde (fecha)</label>
                          <input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>{field.state.meta?.error}</div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="hasta">
                    {(field: any) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hasta (fecha)</label>
                          <input
                              type="date"
                              value={field.state.value}
                              min={formData.state.values.desde}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>{field.state.meta?.error}</div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="horaInicio">
                    {(field: any) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hora inicio</label>
                          <input
                              type="time"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>{field.state.meta?.error}</div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="horaFin">
                    {(field: any) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hora fin</label>
                          <input
                              type="time"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>{field.state.meta?.error}</div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="duracionMinutos">
                    {(field: any) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Duración (minutos)</label>
                          <input
                              type="number"
                              min={15}
                              step={15}
                              value={field.state.value}
                              onChange={(e) =>
                                  field.handleChange(Number(e.target.value))
                              }
                              className={styles.input}
                          />
                          <div className={styles.inputError}>{field.state.meta?.error}</div>
                        </div>
                    )}
                  </formData.AppField>
                </div>
                {loadingFranjas && (
                    <div className={styles.loader}>
                      <span className={styles.spinner}></span>
                      <span>Generando franjas horarias...</span>
                    </div>
                )}
                <div className={styles.buttonRow}>
                  <formData.SubmitButton className={styles.submitButton}>
                    Registrar cancha
                  </formData.SubmitButton>
                </div>
              </formData.FormContainer>
            </formData.AppForm>
          </div>
        </div>
      </CommonLayout>
  );
};

export default CanchaScreen;
