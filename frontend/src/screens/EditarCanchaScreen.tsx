import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useCanchas, useEditarCancha } from "@/services/CanchaService";
import type { Cancha, CanchaEditRequest } from "@/models/Cancha";

const EditarCanchaScreen: React.FC = () => {
    const params = useParams();
    const id = Number(params.id);
    const { data: canchas } = useCanchas();
    const cancha: Cancha | undefined = (canchas as Cancha[] | undefined)?.find((c) => c.id === id);

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [tipoCesped, setTipoCesped] = useState<"Sintetico" | "Natural">("Sintetico");
    const [iluminacion, setIluminacion] = useState(false);
    const [zona, setZona] = useState("");
    const [activa, setActiva] = useState(true);

    const [, navigate] = useLocation();

    useEffect(() => {
        if (cancha) {
            setNombre(cancha.nombre ?? "");
            setDireccion(cancha.direccion ?? "");
            setTipoCesped((cancha.tipoCesped as "Sintetico" | "Natural") ?? "Sintetico");
            setIluminacion(cancha.iluminacion);
            setZona(cancha.zona ?? "");
            setActiva(cancha.activa ?? true);
        }
    }, [cancha]);

    const editarCancha = useEditarCancha({
        onSuccess: () => {
            alert("Cancha editada correctamente");
            navigate("/admin/canchas");
        },
        onError: (error: unknown) => {
            if (error && typeof error === "object" && "message" in error) {
                alert("Error al editar cancha: " + (error as { message: string }).message);
            } else {
                alert("Error al editar cancha");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editarCancha.mutate({
            id,
            data: { nombre, direccion, tipoCesped, iluminacion, zona, activa } as CanchaEditRequest,
        });
    };

    if (!cancha) return <div>Cargando datos de la cancha...</div>;

    return (
        <div className="container mt-4">
            <h2>Editar Cancha</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nombre:</label>
                    <input
                        className="form-control"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Dirección:</label>
                    <input
                        className="form-control"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Tipo Césped:</label>
                    <select
                        className="form-control"
                        value={tipoCesped}
                        onChange={e => setTipoCesped(e.target.value as "Sintetico" | "Natural")}
                        required
                    >
                        <option value="Sintetico">Sintético</option>
                        <option value="Natural">Natural</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Iluminación:</label>
                    <input
                        type="checkbox"
                        checked={iluminacion}
                        onChange={e => setIluminacion(e.target.checked)}
                    />
                </div>
                <div className="mb-3">
                    <label>Zona:</label>
                    <input
                        className="form-control"
                        value={zona}
                        onChange={e => setZona(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>
                        <input
                            type="checkbox"
                            checked={activa}
                            onChange={e => setActiva(e.target.checked)}
                        />
                        {" "}
                        Activa
                    </label>
                </div>
                <button className="btn btn-success" type="submit" disabled={editarCancha.isPending}>
                    {editarCancha.isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
};

export default EditarCanchaScreen;
