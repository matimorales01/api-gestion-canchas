export type PartidoAbiertoResponseDTO = {
    idPartido: number;
    nroCancha: number;
    fechaPartido: string;
    horaPartido: string;
    minJugador: number;
    maxJugador: number;
    cuposDisponibles: number;
    organizadorId: number;
    emailOrganizador: string;
    inscripto: boolean;
    partidoConfirmado: boolean;
};

export type PartidoCerradoResponseDTO = {
    idPartido: number;
    fechaPartido: string;
    horaPartido: string;
    nroCancha: number;
    equipo1: string;
    equipo2: string;
    organizadorId: number;
    emailOrganizador: string;
};
