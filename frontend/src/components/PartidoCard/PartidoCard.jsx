import "./PartidoCardHistoria.css";

function formatearFecha(fechaIso) {
    const [yyyy, mm, dd] = fechaIso.split("-");
    return `${dd}/${mm}/${yyyy}`;
}

export function PartidoCerradoCard({ canchaNombre, canchaDireccion, fecha, hora, equipoA, equipoB }) {
    return (
        <article className="partido-card">
            <p className="info">{canchaNombre}</p>
            <p className="info">{canchaDireccion}</p>
            <p className="info">{formatearFecha(fecha)}</p>
            <p className="info">{hora}</p>
            <p className="info"><strong>{equipoA}</strong></p>
            <p className="info"><strong>{equipoB}</strong></p>
        </article>
    );
}

export function PartidoAbiertoCard({ canchaNombre, canchaDireccion, fecha, hora, minJugadores, maxJugadores, organizadorMail }) {
    return (
        <article className="partido-card">
            <p className="info">{canchaNombre}</p>
            <p className="info">{canchaDireccion}</p>
            <p className="info">{formatearFecha(fecha)}</p>
            <p className="info">{hora}</p>
            <p className="info">{minJugadores}</p>
            <p className="info">{maxJugadores}</p>
            <p className="info">{organizadorMail}</p>
        </article>
    );
}

export function PartidoAbiertoHeader() {
    return (
        <article className="partido-card-header">
            <p className="info-header">Cancha</p>
            <p className="info-header">Dirección</p>
            <p className="info-header">Fecha</p>
            <p className="info-header">Horario</p>
            <p className="info-header">Mínimo Jugadores</p>
            <p className="info-header">Máximo Jugadores</p>
            <p className="info-header">Organizador</p>
        </article>
    );
}

export function PartidoCerradoHeader() {
    return (
        <article className="partido-card-header">
            <p className="info-header">Cancha</p>
            <p className="info-header">Dirección</p>
            <p className="info-header">Fecha</p>
            <p className="info-header">Horario</p>
            <p className="info-header">Equipo 1</p>
            <p className="info-header">Equipo 2</p>
        </article>
    );
}
