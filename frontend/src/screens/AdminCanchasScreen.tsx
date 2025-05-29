import React from "react";
import { useCanchas, useEliminarCancha } from "@/services/CanchaService";
import { Link } from "wouter";
import type { Cancha } from "@/models/Cancha";

const AdminCanchasScreen: React.FC = () => {
    const { data: canchas, isLoading, isError } = useCanchas();
    const eliminarCancha = useEliminarCancha({
        onSuccess: () => {
            alert("Cancha eliminada correctamente");
        },
        onError: (error: unknown) => {
            if (error && typeof error === "object" && "message" in error) {
                alert("Error al eliminar cancha: " + (error as { message: string }).message);
            } else {
                alert("Error al eliminar cancha");
            }
        },

    });

    const handleDelete = (id: number) => {
        if (window.confirm("¿Seguro que querés eliminar la cancha?")) {
            eliminarCancha.mutate(id);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Panel de Administración de Canchas</h2>
            {isLoading && <p>Cargando canchas...</p>}
            {isError && <p>Error al cargar las canchas</p>}
            {!isLoading && !isError && canchas && (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Tipo Césped</th>
                        <th>Iluminación</th>
                        <th>Zona</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(canchas as Cancha[]).map((cancha: Cancha) => (
                        <tr key={cancha.id}>
                            <td>{cancha.nombre}</td>
                            <td>{cancha.direccion}</td>
                            <td>{cancha.tipoCesped}</td>
                            <td>{cancha.iluminacion ? "Sí" : "No"}</td>
                            <td>{cancha.zona}</td>
                            <td>{cancha.activa ? "Activa" : "Inactiva"}</td>
                            <td>
                                <Link href={`/admin/canchas/${cancha.id}`}>
                                    <button className="btn btn-primary btn-sm me-2">
                                        Editar
                                    </button>
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(cancha.id)}
                                    disabled={eliminarCancha.isPending}
                                >
                                    {eliminarCancha.isPending ? "Eliminando..." : "Eliminar"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminCanchasScreen;
