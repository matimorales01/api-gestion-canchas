import { Redirect, Route, Switch } from "wouter";

import { LoginScreen } from "@/screens/LoginScreen";
import { MainScreen } from "@/screens/MainScreen";
import { SignupScreen } from "@/screens/SignupScreen";
import { useToken } from "@/services/TokenContext";
import { CanchaScreen } from "@/screens/CrearCancha";
import { CrearPartidoAbiertoScreen } from "./screens/CrearPartidoAbierto";
import { LoginRequestSchema } from "./models/Login";
import ListaPartidosAbiertos from "./screens/ListaPartidosAbiertos";

export const Navigation = () => {
  const [tokenState] = useToken();
  switch (tokenState.state) {
    case "LOGGED_IN":
      return (
        <Switch>
          <Route path="/">
            <MainScreen />
          </Route>
          <Route path="/crear-cancha">
            <CanchaScreen />
            </Route>
            <Route path="/listar-partidos-abiertos">
            <ListaPartidosAbiertos />
            </Route>
          <Route path="/crear-partido-abierto">
            <CrearPartidoAbiertoScreen />
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
      // Make the compiler check this is unreachable
      return tokenState satisfies never;
  }
};
