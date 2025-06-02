import "./PartidoCardHistoria.css";

export function PartidoCard({ id, cancha, fecha, equipoA, equipoB }) {
    return (
        <article className="partido-card">
            <p className="info">{id}</p>
            <p className="info">{cancha}</p>
            <p className="info">{new Date(fecha).toLocaleString()}</p>
            <p className="info"><strong>{equipoA}</strong> vs <strong>{equipoB}</strong></p>
        </article>
    );
}

export function PartidoAbiertoHeader() {
    return (
        <article className="partido-card">
            <p className="info-header">ID</p>
            <p className="info-header">Cancha</p>
            <p className="info-header">Fecha</p>
            <p className="info-header"><strong>Equipos</strong></p>
        </article>
    );
}