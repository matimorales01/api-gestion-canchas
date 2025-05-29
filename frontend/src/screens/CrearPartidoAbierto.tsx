    import React, { useState } from "react";
    import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
    import { useAppForm } from "@/config/use-app-form";
    import { CrearPartidoSchema } from "@/models/Partido";
    import { useCrearPartido, useGetCanchas } from "@/services/PartidoService";

    const canchas = [
    { id: 1, nombre: "Cancha Norte", zona: "Barrio Norte" },
    { id: 2, nombre: "Cancha Sur", zona: "Barracas" },
    { id: 3, nombre: "Cancha Oeste", zona: "Liniers" },
    { id: 4, nombre: "Cancha Central", zona: "Microcentro" },
    { id: 5, nombre: "Cancha Este", zona: "Puerto Madero" },
]; 


    export const CrearPartidoAbiertoScreen = () => {
    //const { data: canchas, isLoading, isError } = useGetCanchas();
    const { mutate } = useCrearPartido();

    const formData = useAppForm({
        defaultValues: {
        cancha: "",
        franjaHoraria: "",
        jugadoresMinimos: "",
        jugadoresMaximos: "",
        fecha: "",
        horario: "",
        cupos: "",
        },
        validators: {
        onChange: CrearPartidoSchema,
        },
        onSubmit: async (values) => {
        mutate(values, {
            onSuccess: () => {
            alert("¡Partido creado con éxito!");
            },
            onError: (error) => {
            alert("Error al crear el partido: " + error.message);
            },
        });
        },
    });

    const { AppForm, FormContainer, AppField, form } = formData;
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedId(id);
        form.setValue("cancha", id.toString());
    };
/**
    if (isLoading) {
        return (
        <CommonLayout>
            <p>Cargando canchas...</p>
        </CommonLayout>
        );
    }

    if (isError) {
        return (
        <CommonLayout>
            <p>Error al cargar las canchas.</p>
        </CommonLayout>
        );
    }
 */
    return (
        <CommonLayout>
        <AppForm>
            <FormContainer extraError={null}>
            <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
                <h2>Selecciona una Cancha</h2>
                <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
                >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Ubicación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {canchas.map(({ id,nombre, zona }) => (
                        <tr
                        key={id}
                        onClick={() => handleRowClick(id)}
                        style={{
                            backgroundColor: selectedId === id ? "#ffe58f" : "white",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = selectedId === id ? "#ffe58f" : "white")
                        }
                        >
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{nombre}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{zona}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            <div>
                <AppField name="jugadoresMinimos" children={(field) => <field.TextField label="Jugadores Mínimos" />} />
                <AppField name="jugadoresMaximos" children={(field) => <field.TextField label="Jugadores Máximos" />} />
                <AppField name="fecha" children={(field) => <field.TextField label="Fecha" />} />
                <AppField name="horario" children={(field) => <field.TextField label="Horario" />} />
                <AppField name="cupos" children={(field) => <field.TextField label="Cupos" />} />
                <AppField name="franjaHoraria" children={(field) => <field.TextField label="Franja Horaria" />} />
            </div>
            
        </FormContainer>
        </AppForm>
        </CommonLayout>
    );
};
