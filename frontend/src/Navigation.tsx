import { Redirect, Route, Switch } from "wouter";

import { LoginScreen } from "@/screens/LoginScreen";
import { MainScreen } from "@/screens/MainScreen";
import { SignupScreen } from "@/screens/SignupScreen";
import { useToken } from "@/services/TokenContext";
import { CanchaScreen } from "@/screens/CrearCancha";
import { HistorialScreen } from "@/screens/HistorialScreen";
import AdminCanchasScreen from "@/screens/AdminCanchasScreen";
import EditarCanchaScreen from "@/screens/EditarCanchaScreen";
import { CrearPartidoAbiertoScreen } from "./screens/CrearPartidoAbierto";
import {CrearPartidoCerradoScreen} from "@/screens/CrearPartidoCerrado.tsx";
import ListaPartidosAbiertos from "./screens/ListaPartidosAbiertos";
import { CrearEquipo } from "./screens/CrearEquipo";
import { LoginRequestSchema } from "./models/Login";
import { CrearReservaScreen } from "./screens/CrearReservaScreen";
import { AdministrarReservasScreen } from "./screens/AdministrarReservasScreen";


export const Navigation = () => {

    const [tokenState] = useToken();
    switch (tokenState.state) {
        case "LOGGED_IN":
            return (
                <Switch>
                    <Route path="/">
                        <MainScreen />
                    </Route>
                    <Route path="/listar-partidos-abiertos">
                      <ListaPartidosAbiertos />
                    </Route>
                    <Route path="/crear-cancha">
                        <CanchaScreen />
                    </Route>
                    <Route path="/admin/canchas">
                        <AdminCanchasScreen />
                    </Route>
                    <Route path="/admin/canchas/:id">
                        <EditarCanchaScreen />
                    </Route>
                    <Route path="/crear-reserva">
                        <CrearReservaScreen />
                    </Route>
                    <Route path="/administrar-reservas">
                      <AdministrarReservasScreen />
                    </Route>
                    <Route path="/crear-equipo">
                        <CrearEquipo />
                    </Route>
                    <Route path="/ver-historial">
                      <HistorialScreen />
                    </Route>
                    <Route>
                        <Redirect href="/" />
                    </Route>
                </Switch>
            );
        case "LOGGED_OUT":
            return (
                <Switch>
                    <Route path="/login">
                        <LoginScreen />
                    </Route>
                    <Route path="/signup">
                        <SignupScreen />
                    </Route>
                    <Route>
                        <Redirect href="/signup" />
                    </Route>
                </Switch>
            );
        default:
            return tokenState satisfies never;
    }
};
