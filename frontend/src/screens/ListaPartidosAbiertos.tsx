import { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
//import { usePartidoAbierto } from "@/services/PartidoService";

const partidos = [
{ id: 1, nombre: "Cancha Norte", fecha: "Barrio Norte", hora: "13:12", ocupados: 2, desocupados: 8 },
{ id: 2, nombre: "Cancha Sur", fecha: "Barracas", hora: "14:30", ocupados: 4, desocupados: 6 },
{ id: 3, nombre: "Cancha Oeste", fecha: "Liniers", hora: "15:00", ocupados: 1, desocupados: 9 },
{ id: 4, nombre: "Cancha Central", fecha: "Microcentro", hora: "16:00", ocupados: 6, desocupados: 4 },
{ id: 5, nombre: "Cancha Este", fecha: "Puerto Madero", hora: "17:00", ocupados: 5, desocupados: 5 },
];
//const { data: partidos, isLoading, isError } = usePartidoAbierto();
const partidosView = () => {
const [selectedId, setSelectedId] = useState<number | null>(null);


/**if (isLoading) {
    return (
    <CommonLayout>
        <p>Cargando partidos...</p>
    </CommonLayout>
    );
}

if (isError) {
    return (
    <CommonLayout>
        <p>Error al cargar las partidos.</p>
    </CommonLayout>
    );
}
 */
return (
    <CommonLayout>
    <div
        style={{
        maxWidth: 600,
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "black",
        padding: "16px",
        borderRadius: "8px",
        }}
    >
        <h2 style={{ color: "white", textAlign: "center" }}>Lista de partidos abiertos</h2>
        <table
        style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid white",
            backgroundColor: "black",
            color: "white",
        }}
        >
        <thead>
            <tr style={{ backgroundColor: "black", color: "white" }}>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Ubicación</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Hora</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Ocupados</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Desocupados</th>
            </tr>
        </thead>
        <tbody>
            {partidos.map(({ id, nombre, fecha, hora, ocupados, desocupados }) => (
            <tr
                key={id}
                onClick={() => setSelectedId(id)}
                style={{
                backgroundColor: selectedId === id ? "#333" : "black",
                color: "white",
                cursor: "pointer",
                transition: "background-color 0.3s",
                }}
            >
                <td style={{ padding: "12px 16px", borderBottom: "1px solid white" }}>{nombre}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid white" }}>{fecha}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid white" }}>{hora}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid white" }}>{ocupados}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid white" }}>{desocupados}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </CommonLayout>
);
};

export default partidosView;
