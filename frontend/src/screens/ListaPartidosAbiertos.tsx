import React, { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {  useGetCanchas } from "@/services/PartidoService";


const canchas = [
    { id: 1, nombre: "Cancha Norte", zona: "Barrio Norte" },
    { id: 2, nombre: "Cancha Sur", zona: "Barracas" },
    { id: 3, nombre: "Cancha Oeste", zona: "Liniers" },
    { id: 4, nombre: "Cancha Central", zona: "Microcentro" },
    { id: 5, nombre: "Cancha Este", zona: "Puerto Madero" },
    ];

    const CanchasView = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <CommonLayout>
        <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
            <h2>Selecciona una Cancha</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
            <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Ubicación</th>
                </tr>
            </thead>
            <tbody>
                {canchas.map(({ id, nombre, zona }) => (
                <tr
                    key={id}
                    onClick={() => setSelectedId(id)}
                    style={{
                    backgroundColor: selectedId === id ? "#ffe58f" : "white",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    }}
                >
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{nombre}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{zona}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </CommonLayout>
    );
    };

export default CanchasView;
