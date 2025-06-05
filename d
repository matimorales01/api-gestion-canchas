[1mdiff --git a/.idea/ClojureProjectResolveSettings.xml b/.idea/ClojureProjectResolveSettings.xml[m
[1mnew file mode 100644[m
[1mindex 0000000..df470b1[m
[1m--- /dev/null[m
[1m+++ b/.idea/ClojureProjectResolveSettings.xml[m
[36m@@ -0,0 +1,6 @@[m
[32m+[m[32m<?xml version="1.0" encoding="UTF-8"?>[m
[32m+[m[32m<project version="4">[m
[32m+[m[32m  <component name="ClojureProjectResolveSettings">[m
[32m+[m[32m    <currentScheme>IDE</currentScheme>[m
[32m+[m[32m  </component>[m
[32m+[m[32m</project>[m
\ No newline at end of file[m
[1mdiff --git a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/Reserva.java b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/Reserva.java[m
[1mindex 6935038..2f50dc3 100644[m
[1m--- a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/Reserva.java[m
[1m+++ b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/Reserva.java[m
[36m@@ -5,6 +5,7 @@[m [mimport java.time.LocalDate;[m
 import java.time.LocalTime;[m
 import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;[m
 import ar.uba.fi.ingsoft1.todo_template.user.User;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;[m
 [m
 @Entity[m
 @Table(name = "reservas")[m
[36m@@ -49,4 +50,8 @@[m [mpublic class Reserva {[m
 [m
     public LocalTime getHoraFin() { return horaFin; }[m
     public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }[m
[32m+[m
[32m+[m[32m    public ReservaDTO toReservaDTO() {[m
[32m+[m[32m        return new ReservaDTO(id, cancha.getId(), fecha, horaInicio, horaFin);[m
[32m+[m[32m    }[m
 }[m
[1mdiff --git a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRepository.java b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRepository.java[m
[1mindex d9959e5..6763026 100644[m
[1m--- a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRepository.java[m
[1m+++ b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRepository.java[m
[36m@@ -2,6 +2,7 @@[m [mpackage ar.uba.fi.ingsoft1.todo_template.reserva;[m
 [m
 import java.time.LocalDate;[m
 import java.time.LocalTime;[m
[32m+[m[32mimport java.util.Optional;[m
 [m
 import org.springframework.data.jpa.repository.JpaRepository;[m
 import org.springframework.data.jpa.repository.Query;[m
[36m@@ -32,5 +33,7 @@[m [mpublic interface ReservaRepository extends JpaRepository<Reserva, Long> {[m
         @Param("horaFin") LocalTime horaFin[m
 [m
     );[m
[32m+[m
[32m+[m[32m    Optional<Reserva> findByUserId(Long id);[m
     [m
 }[m
[1mdiff --git a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRestController.java b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRestController.java[m
[1mindex 5cf33ed..1d16b89 100644[m
[1m--- a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRestController.java[m
[1m+++ b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaRestController.java[m
[36m@@ -7,6 +7,7 @@[m [mimport org.springframework.web.bind.annotation.*;[m
 import jakarta.validation.Valid;[m
 [m
 import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;[m
 import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;[m
 import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;[m
 import org.springframework.security.core.Authentication;[m
[36m@@ -36,4 +37,9 @@[m [mpublic class ReservaRestController {[m
         }[m
     }[m
 [m
[32m+[m
[32m+[m[32m    @GetMapping[m
[32m+[m[32m    public ResponseEntity<ReservaDTO> obtenerReserva() {[m
[32m+[m[32m        return ResponseEntity.ok(reservaService.obtenerReserva());[m
[32m+[m[32m    }[m
 }[m
[1mdiff --git a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaService.java b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaService.java[m
[1mindex 0022f73..ec890c7 100644[m
[1m--- a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaService.java[m
[1m+++ b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/ReservaService.java[m
[36m@@ -1,16 +1,21 @@[m
 package ar.uba.fi.ingsoft1.todo_template.reserva;[m
 [m
[32m+[m[32mimport org.springframework.security.core.context.SecurityContextHolder;[m
 import org.springframework.stereotype.Service;[m
 import org.springframework.transaction.annotation.Transactional;[m
 import java.time.LocalDate;[m
 import java.time.LocalTime;[m
 [m
 import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.user.User;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.user.UserRepository;[m
 import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;[m
 import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;[m
 import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;[m
 import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;[m
 import ar.uba.fi.ingsoft1.todo_template.user.User;[m
[32m+[m[32mimport ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;[m
 [m
 @Service[m
 public class ReservaService {[m
[36m@@ -21,10 +26,10 @@[m [mpublic class ReservaService {[m
     private final UserRepository userRepo;[m
 [m
     public ReservaService([m
[31m-            ReservaRepository reservaRepo,[m
[31m-            FranjaDisponibleRepository franjaRepo,[m
[31m-            CanchaRepository canchaRepo,[m
[31m-            UserRepository userRepo[m
[32m+[m[32m        ReservaRepository reservaRepo,[m
[32m+[m[32m        FranjaDisponibleRepository franjaRepo,[m
[32m+[m[32m        CanchaRepository canchaRepo,[m
[32m+[m[32m        UserRepository userRepo[m
     ) {[m
         this.reservaRepo = reservaRepo;[m
         this.franjaRepo = franjaRepo;[m
[36m@@ -69,4 +74,15 @@[m [mpublic class ReservaService {[m
 [m
         return r;[m
     }[m
[32m+[m
[32m+[m[32m    public ReservaDTO obtenerReserva() {[m
[32m+[m[32m        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()[m
[32m+[m[32m            .getAuthentication().getPrincipal();[m
[32m+[m
[32m+[m[32m        User user = userRepo.findByEmail(userInfo.email())[m
[32m+[m[32m            .orElseThrow(() -> new NotFoundException("Usuario con email: '" + userInfo.email() + "' no encontrado."));[m
[32m+[m
[32m+[m[32m        return reservaRepo.findByUserId(user.getId())[m
[32m+[m[32m            .map(Reserva::toReservaDTO)[m
[32m+[m[32m            .orElseThrow(() -> new NotFoundException("No se encontraron reservas para el usuario con email: '" + userInfo.email() + "'."));    }[m
 }[m
[1mdiff --git a/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/dto/ReservaDTO.java b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/dto/ReservaDTO.java[m
[1mnew file mode 100644[m
[1mindex 0000000..1e7bc7f[m
[1m--- /dev/null[m
[1m+++ b/backend/src/main/java/ar/uba/fi/ingsoft1/todo_template/reserva/dto/ReservaDTO.java[m
[36m@@ -0,0 +1,13 @@[m
[32m+[m[32mpackage ar.uba.fi.ingsoft1.todo_template.reserva.dto;[m
[32m+[m
[32m+[m[32mimport java.time.LocalDate;[m
[32m+[m[32mimport java.time.LocalTime;[m
[32m+[m
[32m+[m[32mpublic record ReservaDTO([m
[32m+[m[32m    Long id,[m
[32m+[m[32m    Long canchaId,[m
[32m+[m[32m    LocalDate fecha,[m
[32m+[m[32m    LocalTime horaInicio,[m
[32m+[m[32m    LocalTime horaFin[m
[32m+[m[32m) {[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/src/Navigation.tsx b/frontend/src/Navigation.tsx[m
[1mindex 09c7ecb..7731645 100644[m
[1m--- a/frontend/src/Navigation.tsx[m
[1m+++ b/frontend/src/Navigation.tsx[m
[36m@@ -12,6 +12,7 @@[m [mimport { CrearPartidoAbiertoScreen } from "./screens/CrearPartidoAbierto";[m
 import {CrearPartidoCerradoScreen} from "@/screens/CrearPartidoCerrado.tsx";[m
 import { LoginRequestSchema } from "./models/Login";[m
 import ListaPartidosAbiertos from "./screens/ListaPartidosAbiertos";[m
[32m+[m[32mimport AdministrarReservasScreen from "@/screens/AdministrarReservasScreen";[m
 [m
 export const Navigation = () => {[m
 [m
[36m@@ -44,6 +45,9 @@[m [mexport const Navigation = () => {[m
                     <Route path="/ver-historial">[m
                       <HistorialScreen />[m
                     </Route>[m
[32m+[m[32m                    <Route path="/administrar-reservas">[m
[32m+[m[32m                      <AdministrarReservasScreen />[m
[32m+[m[32m                    </Route>[m
                     <Route>[m
                         <Redirect href="/" />[m
                     </Route>[m
[1mdiff --git a/frontend/src/components/CommonLayout/CommonLayout.tsx b/frontend/src/components/CommonLayout/CommonLayout.tsx[m
[1mindex 701642d..b57c6f7 100644[m
[1m--- a/frontend/src/components/CommonLayout/CommonLayout.tsx[m
[1m+++ b/frontend/src/components/CommonLayout/CommonLayout.tsx[m
[36m@@ -52,6 +52,9 @@[m [mconst LoggedInLinks = () => {[m
             <li>[m
                 <Link href="/admin/canchas">Panel de Administración</Link>[m
             </li>[m
[32m+[m[32m            <li>[m
[32m+[m[32m                <Link href="/administrar-reservas">Administrar Reservas</Link>[m
[32m+[m[32m            </li>[m
             <li>[m
                 <Link href="/crear-partido-abierto">Crear partido abierto</Link>[m
             </li>[m
[36m@@ -61,8 +64,6 @@[m [mconst LoggedInLinks = () => {[m
             <li>[m
                 <Link href="/ver-historial">Historial</Link>[m
             </li>[m
[31m-            <li>Projects</li>[m
[31m-            <li>Tasks</li>[m
             <li>[m
                 <button onClick={logOut}>Log out</button>[m
             </li>[m
[1mdiff --git a/frontend/src/components/ReservasAdmin/ReservasAdmin.css b/frontend/src/components/ReservasAdmin/ReservasAdmin.css[m
[1mnew file mode 100644[m
[1mindex 0000000..e0684d0[m
[1m--- /dev/null[m
[1m+++ b/frontend/src/components/ReservasAdmin/ReservasAdmin.css[m
[36m@@ -0,0 +1,38 @@[m
[32m+[m[32m.reservas-header {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    justify-content: space-between;[m
[32m+[m[32m    align-items: center;[m
[32m+[m[32m    border: 1px solid black;[m
[32m+[m[32m    background-color: #a1a1a1b9;[m
[32m+[m[32m    padding: 0.5rem;[m
[32m+[m[32m    width: 100%;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.reserva-info {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    justify-content: space-between;[m
[32m+[m[32m    align-items: center;[m
[32m+[m[32m    border: 1px solid black;[m
[32m+[m[32m    background-color: #e0dfdf;[m
[32m+[m[32m    padding: 0.5rem;[m
[32m+[m[32m    width: 100%;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.headers {[m
[32m+[m[32m    flex: 1; /* Cada <p> ocupa el mismo espacio */[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m    color: black;[m
[32m+[m[32m    font-family: system-ui;[m
[32m+[m[32m    font-size: 1rem;[m
[32m+[m[32m    margin: 0 0.25rem; /* pequeño margen horizontal */[m
[32m+[m[32m    font-weight: bold;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.info {[m
[32m+[m[32m    flex: 1; /* Cada <p> ocupa el mismo espacio */[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m    color: black;[m
[32m+[m[32m    font-family: system-ui;[m
[32m+[m[32m    font-size: 1rem;[m
[32m+[m[32m    margin: 0 0.25rem; /* pequeño margen horizontal */[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/frontend/src/components/ReservasAdmin/ReservasAdmin.jsx b/frontend/src/components/ReservasAdmin/ReservasAdmin.jsx[m
[1mnew file mode 100644[m
[1mindex 0000000..fcdcf96[m
[1m--- /dev/null[m
[1m+++ b/frontend/src/components/ReservasAdmin/ReservasAdmin.jsx[m
[36m@@ -0,0 +1,26 @@[m
[32m+[m[32mimport "./ReservasAdmin.css"[m
[32m+[m[32mexport function ReservasHeader() {[m
[32m+[m[32m    return ([m
[32m+[m[32m        <article className="reservas-header">[m
[32m+[m[32m            <p className="headers">Mis canchas</p>[m
[32m+[m[32m            <p className="headers">Estado</p>[m
[32m+[m[32m            <p className="headers">Tipo de Partido</p>[m
[32m+[m[32m            <p className="headers">Hora</p>[m
[32m+[m[32m            <p className="headers">Usuario</p>[m
[32m+[m[32m            <p className="headers"></p>[m
[32m+[m[32m        </article>[m
[32m+[m[32m    );[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function InfoReserva({ nombreCancha, estado, tipo, hora, usuario }) {[m
[32m+[m[32m    return ([m
[32m+[m[32m        <article className="reserva-info">[m
[32m+[m[32m            <p className="info">{nombreCancha}</p>[m
[32m+[m[32m            <p className="info">{estado}</p>[m
[32m+[m[32m            <p className="info">{tipo}</p>[m
[32m+[m[32m            <p className="info">{hora}</p>[m
[32m+[m[32m            <p className="info">{usuario}</p>[m
[32m+[m[32m            <p className="info">---</p>[m
[32m+[m[32m        </article>[m
[32m+[m[32m    );[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/src/screens/AdministrarReservasScreen.tsx b/frontend/src/screens/AdministrarReservasScreen.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..9264c06[m
[1m--- /dev/null[m
[1m+++ b/frontend/src/screens/AdministrarReservasScreen.tsx[m
[36m@@ -0,0 +1,57 @@[m
[32m+[m[32mimport { CommonLayout } from "@/components/CommonLayout/CommonLayout";[m
[32m+[m[32mimport { useCanchas } from "@/services/CanchaService";[m
[32m+[m[32mimport { useFranjasPorCancha } from "@/services/FranjaService";[m
[32m+[m[32mimport React, { useState } from "react";[m
[32m+[m[32mimport {ReservasHeader, InfoReserva} from "@/components/ReservasAdmin/ReservasAdmin";[m
[32m+[m[32mexport const AdministrarReservasScreen = () => {[m
[32m+[m[32m  const reservas = [[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 1,[m
[32m+[m[32m    cancha: "Cancha Norte",[m
[32m+[m[32m    estado: "Reservado",[m
[32m+[m[32m    tipo: "Abierto",[m
[32m+[m[32m    hora: "18:00",[m
[32m+[m[32m    usuario: "Juan Pérez",[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 2,[m
[32m+[m[32m    cancha: "Cancha Sur",[m
[32m+[m[32m    estado: "Libre",[m
[32m+[m[32m    tipo: "Cerrado",[m
[32m+[m[32m    hora: "19:30",[m
[32m+[m[32m    usuario: "",[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 3,[m
[32m+[m[32m    cancha: "Cancha Central",[m
[32m+[m[32m    estado: "Reservado",[m
[32m+[m[32m    tipo: "Cerrado",[m
[32m+[m[32m    hora: "21:00",[m
[32m+[m[32m    usuario: "María López",[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 4,[m
[32m+[m[32m    cancha: "Cancha Este",[m
[32m+[m[32m    estado: "Libre",[m
[32m+[m[32m    tipo: "Abierto",[m
[32m+[m[32m    hora: "17:15",[m
[32m+[m[32m    usuario: "",[m
[32m+[m[32m  },[m
[32m+[m[32m];[m
[32m+[m[32m  return ([m
[32m+[m[32m    <CommonLayout>[m
[32m+[m[32m      <h1>Reservas</h1>[m
[32m+[m[32m      <div style={{ width: "100%", height: "100%"}}>[m
[32m+[m[32m        {reservas.length === 0 ? (<p>No hay partidos cerrados.</p>) : ([m
[32m+[m[32m        <ul>[m
[32m+[m[32m          <ReservasHeader />[m
[32m+[m[32m          {reservas.map(({id, cancha, estado, tipo, hora, usuario}) => ([m
[32m+[m[32m              <InfoReserva key={id} nombreCancha={cancha} estado={estado} tipo={tipo} hora={hora} usuario={usuario} />[m
[32m+[m[32m            ))}[m
[32m+[m[32m        </ul>[m
[32m+[m[32m        )}[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </CommonLayout>[m
[32m+[m[32m  );[m
[32m+[m[32m};[m
[32m+[m[32mexport default AdministrarReservasScreen;[m
[1mdiff --git a/frontend/src/services/FranjaService.ts b/frontend/src/services/FranjaService.ts[m
[1mnew file mode 100644[m
[1mindex 0000000..db52e40[m
[1m--- /dev/null[m
[1m+++ b/frontend/src/services/FranjaService.ts[m
[36m@@ -0,0 +1,32 @@[m
[32m+[m[32mimport { useQuery } from "@tanstack/react-query";[m
[32m+[m[32mimport { BASE_API_URL } from "@/config/app-query-client";[m
[32m+[m[32mimport { useToken } from "@/services/TokenContext";[m
[32m+[m[32mimport type { Franja } from "@/models/Franja";[m
[32m+[m
[32m+[m[32mexport function useFranjasPorCancha(canchaId: number, fecha: string) {[m
[32m+[m[32m  const [tokenState] = useToken();[m
[32m+[m
[32m+[m[32m  return useQuery<Franja[]>({[m
[32m+[m[32m    queryKey: ["franjas", canchaId, fecha],[m
[32m+[m[32m    queryFn: async () => {[m
[32m+[m[32m      if (tokenState.state !== "LOGGED_IN") {[m
[32m+[m[32m        throw new Error("No estás logueado.");[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m      const response = await fetch(`${BASE_API_URL}/franjas?canchaId=${canchaId}&fecha=${fecha}`, {[m
[32m+[m[32m        headers: {[m
[32m+[m[32m          Accept: "application/json",[m
[32m+[m[32m          Authorization: `Bearer ${tokenState.accessToken}`,[m
[32m+[m[32m        },[m
[32m+[m[32m      });[m
[32m+[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        const errorText = await response.text();[m
[32m+[m[32m        throw new Error(`Error al obtener franjas: ${errorText}`);[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m      return await response.json() as Franja[];[m
[32m+[m[32m    },[m
[32m+[m[32m    enabled: tokenState.state === "LOGGED_IN" && !!canchaId && !!fecha,[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
