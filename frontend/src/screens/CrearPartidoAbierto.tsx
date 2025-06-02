import React, { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CrearPartidoSchema } from "@/models/Partido";
import { useCrearPartido } from "@/services/PartidoService";
import { useCanchas } from "@/services/CanchaService";

export const CrearPartidoAbiertoScreen = () => {
const { data: canchas, isLoading, isError } = useCanchas();
const { mutate } = useCrearPartido();

const form = useAppForm({
    defaultValues: {
    nroCancha: "",
    horaPartido: "",
    minJugadores: "",
    maxJugadores: "",
    fechaPartido: "",
    },
    validators: {
    onChange: CrearPartidoSchema,
    },
    onSubmit: async (values) => {

    mutate(values.value, {
        onSuccess: () => {
        alert("¡Partido creado con éxito!");
        },
        onError: (error) => {
        if (error instanceof Error) {
            alert("Error al crear el partido: " + error.message);
        } else {
            alert("Error desconocido al crear el partido");
        }
    }

    });
    },
});

const { AppForm, FormContainer, AppField } = form;

const [selectedId, setSelectedId] = useState<number | null>(null);

const handleRowClick = (id: number) => {
    setSelectedId(id);
    form.setFieldValue("nroCancha", id.toString());
    };

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
               <div>
                <AppField name="minJugadores" children={(field) => <field.TextField label="Jugadores Mínimos" />} />
                <AppField name="maxJugadores" children={(field) => <field.TextField label="Jugadores Máximos" />} />
                <AppField name="fechaPartido" children={(field) => <field.TextField label="Fecha" />} />
                <AppField name="horaPartido" children={(field) => <field.TextField label="Franja Horaria" />} />
            </div>
            </div>
            
        </FormContainer>
    </AppForm>
    </CommonLayout>
);
};
