import React, { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CrearPartidoSchema } from "@/models/Partido";
import { useCrearPartido } from "@/services/UserServices";

const canchas = [
    { id: 1, nombre: "Cancha A", ubicacion: "Barrio Norte" },
    { id: 2, nombre: "Cancha B", ubicacion: "Palermo" },
    { id: 3, nombre: "Cancha C", ubicacion: "Villa Urquiza" },
    ];

    export const CrearPartidoAbiertoScreen = () => {
    const { mutate } = useCrearPartido();


    const formData = useAppForm({
        defaultValues: {
        cancha: "",
        franjaHoraria: "",
        jugadoresMinimos: 0,
        jugadoresMaximos: 0,
        fecha: "",
        horario: "",
        canchaConfirmacion: "",
        cupos: 0,
        },
        validators: {
        onChange: CrearPartidoSchema,
        },
        onSubmit: async (values) => {
        alert("¡Partido creado con éxito!");
        // mutate({ ...values });
        },
    });

    const { AppForm, FormContainer, AppField, form } = formData;

    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedId(id);
        form.setValue("cancha", id.toString()); // actualizar el formulario con la cancha seleccionada
    };

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
                {canchas.map(({ id, nombre, ubicacion }) => (
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
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{ubicacion}</td>
                </tr>
                ))}
                </tbody>
                </table>
            </div>
        </div>
            <AppField name="franjaHoraria" children={(field) => <field.TextField label="Franja Horaria" />} />
            <AppField name="jugadoresMinimos" children={(field) => <field.TextField label="Jugadores Mínimos" />} />
            <AppField name="jugadoresMaximos" children={(field) => <field.TextField label="Jugadores Máximos" />} />
            <AppField name="fecha" children={(field) => <field.TextField label="Fecha" />} />
            <AppField name="horario" children={(field) => <field.TextField label="Horario" />} />
            <AppField name="canchaConfirmacion" children={(field) => <field.TextField label="Cancha Confirmación" />} />
            <AppField name="cupos" children={(field) => <field.TextField label="Cupos" />} />
            </FormContainer>
        </AppForm>
        </CommonLayout>
    );
};
