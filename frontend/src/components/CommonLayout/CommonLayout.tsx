import React from "react";
import { Link } from "wouter";

import { useToken } from "@/services/TokenContext";

import styles from "./CommonLayout.module.css";

export const CommonLayout = ({ children }: React.PropsWithChildren) => {
    const [tokenState] = useToken();

    return (
        <div className={styles.mainLayout}>
            <ul className={styles.topBar}>
                {tokenState.state === "LOGGED_OUT" ? <LoggedOutLinks /> : <LoggedInLinks />}
            </ul>
            <div className={styles.mainContent} >
                {children}
            </div>
        </div>
    );
};

const LoggedOutLinks = () => {
    return (
        <>
            <li>
                <Link href="/login">Log in</Link>
            </li>
            <li>
                <Link href="/signup">Sign Up</Link>
            </li>
        </>
    );
};

const LoggedInLinks = () => {
    const [, setTokenState] = useToken();

    const logOut = () => {
        setTokenState({ state: "LOGGED_OUT" });
    };

    return (
        <>
            <li>
                <Link href="/under-construction">Main Page</Link>
            </li>
            <li>
                <Link href="/crear-cancha">Crear Cancha</Link>
            </li>
            <li>
                <Link href="/crear-equipo">Crear Equipo</Link>
            </li>
            <li>
                <Link href="/crear-torneo">Crear Torneo</Link>
            </li>
            <li>
                <Link href="/listar-torneos">Torneos Disponibles</Link>
            </li>
            <li>
                <Link href="/listar-partidos-abiertos">Listar partidos abiertos</Link>
            </li>
            <li>
                <Link href="/admin/canchas">Panel de Administración</Link>
            </li>
            <li>
                <Link href="/crear-reserva">Crear reserva</Link>
            </li>
            <li>
                <Link href="/administrar-reservas">Administrar reserva</Link>
            </li>
            <li>
                <Link href="/ver-historial">Historial</Link>
            </li>
            <li>
                <button onClick={logOut}>Log out</button>
            </li>
        </>
    );
};
