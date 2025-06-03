import "./PartidoCardHistoria.css";

export function PartidoCerradoCard({ id, cancha, fecha, hora, equipoA, equipoB }) {
    return (
        <article className="partido-card">
            <p className="info">{id}</p>
            <p className="info">{cancha}</p>
            <p className="info">{new Date(fecha).toLocaleString()}</p>
            <p className="info">{hora}</p>
            <p className="info"><strong>{equipoA}</strong></p>
            <p className="info"><strong>{equipoB}</strong></p>
        </article>
    );
}

export function PartidoAbiertoCard({ id, nroCancha, fecha, hora, minJugadores, maxJugadores, organizadorMail }) {
    return (
        <article className="partido-card">
            <p className="info">{id}</p>
            <p className="info">{nroCancha}</p>
            <p className="info">{new Date(fecha).toLocaleString()}</p>
            <p className="info">{hora}</p>
            <p className="info">{minJugadores}</p>
            <p className="info">{maxJugadores}</p>
            <p className="info">{maxJugadores - minJugadores}</p>
            <p className="info">{organizadorMail}</p>
        </article>
    );
}

export function PartidoAbiertoHeader() {
    return (
        <article className="partido-card">
            <p className="info-header">ID - Partido</p>
            <p className="info-header">Nro Cancha</p>
            <p className="info-header">Fecha</p>
            <p className="info-header">Horario</p>
            <p className="info-header">Minimo Jugadores</p>
            <p className="info-header">Maximo Jugadores</p>
            <p className="info-header">Cupos libres</p>
            <p className="info-header">Organizador</p>
        </article>
    );
}

export function PartidoCerradoHeader() {
    return (
        <article className="partido-card">
            <p className="info-header">ID - Partido</p>
            <p className="info-header">Nro Cancha</p>
            <p className="info-header">Fecha</p>
            <p className="info-header">Horario</p>
            <p className="info-header">Equipo 1</p>
            <p className="info-header">Equipo 2</p>
        </article>
    );
}