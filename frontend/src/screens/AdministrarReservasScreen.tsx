import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useCanchas } from "@/services/CanchaService";
import { useFranjasPorCancha } from "@/services/FranjaService";
import React, { useState } from "react";
import {ReservasHeader, InfoReserva} from "@/components/ReservasAdmin/ReservasAdmin";
export const AdministrarReservasScreen = () => {
  const reservas = [
  {
    id: 1,
    cancha: "Cancha Norte",
    estado: "Reservado",
    tipo: "Abierto",
    hora: "18:00",
    usuario: "Juan Pérez",
  },
  {
    id: 2,
    cancha: "Cancha Sur",
    estado: "Libre",
    tipo: "Cerrado",
    hora: "19:30",
    usuario: "",
  },
  {
    id: 3,
    cancha: "Cancha Central",
    estado: "Reservado",
    tipo: "Cerrado",
    hora: "21:00",
    usuario: "María López",
  },
  {
    id: 4,
    cancha: "Cancha Este",
    estado: "Libre",
    tipo: "Abierto",
    hora: "17:15",
    usuario: "",
  },
];
  return (
    <CommonLayout>
      <h1>Reservas</h1>
      <div style={{ width: "100%", height: "100%"}}>
        {reservas.length === 0 ? (<p>No hay partidos cerrados.</p>) : (
        <ul>
          <ReservasHeader />
          {reservas.map(({id, cancha, estado, tipo, hora, usuario}) => (
              <InfoReserva key={id} nombreCancha={cancha} estado={estado} tipo={tipo} hora={hora} usuario={usuario} />
            ))}
        </ul>
        )}
      </div>
    </CommonLayout>
  );
};
export default AdministrarReservasScreen;