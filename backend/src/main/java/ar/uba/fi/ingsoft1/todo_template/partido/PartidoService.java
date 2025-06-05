package ar.uba.fi.ingsoft1.todo_template.partido;



import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;

import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoAbiertoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCerradoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaRepository;
import ar.uba.fi.ingsoft1.todo_template.user.EmailService;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PartidoService {
    private final PartidoRepository partidoRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ReservaRepository reservaRepository;

    public PartidoService(
        PartidoRepository partidoRepository,
        EmailService emailService,
        UserRepository userRepository,


        ReservaRepository reservaRepository
        ) {
            this.partidoRepository = partidoRepository;
            this.emailService=emailService;
            this.userRepository=userRepository;
            this.reservaRepository=reservaRepository;
        }

    private User autentificarUser(){
        JwtUserDetails infoUser=(JwtUserDetails) SecurityContextHolder.getContext()
                                .getAuthentication().getPrincipal();
        String emailUser= infoUser.email();

        User organizador=userRepository.findByEmail(emailUser)
                            .orElseThrow(()->new NotFoundException("El email no esta registrado"));

        if (!organizador.getState()) {
            throw new IllegalStateException("Antes de crear un partido debe estar registrado");

        }
        return organizador;


    }

    private boolean reservaExiste(Long canchaId, LocalDate fecha, LocalTime horaInicio){

        LocalTime horaFin=horaInicio.plusHours(1);

        return(reservaRepository.existsReservaConHorarioExacto(
            canchaId,
            fecha,
            horaInicio,
            horaFin));



    }

    private void envioDeEmailPorCreacion(String email, Partido partido, String tipo){

        emailService.sendCreationPartido(email,
            partido.getNroCancha().toString(),
            partido.getFechaPartido().toString(),
            partido.getHoraPartido().toString(),
            tipo);

    }
    @Transactional
    public PartidoAbierto crearPartidoAbierto(PartidoAbiertoCreateDTO abiertoDto){

        User organizador=autentificarUser();

        if (!reservaExiste(abiertoDto.canchaId(),
                           abiertoDto.fechaPartido(),
                           abiertoDto.horaPartido())) {
            throw new IllegalStateException("No se encuentra reserva para la cancha y franja horaria");

        }

        PartidoAbierto partidoAbierto=new PartidoAbierto(
            abiertoDto.canchaId(),
            abiertoDto.fechaPartido(),
            abiertoDto.horaPartido(),
            abiertoDto.minJugadores(),
            abiertoDto.maxJugadores(),
            abiertoDto.cuposDisponibles()
            );

        partidoAbierto.setORganizador(organizador);
        partidoAbierto.setEmailOrganizador(organizador.getEmail());

        PartidoAbierto partidoGuardadoA= partidoRepository.save(partidoAbierto);

        envioDeEmailPorCreacion(organizador.getEmail(), partidoGuardadoA,"Abierto");
        return partidoGuardadoA;
    }


    public PartidoCerrado crearPartidoCerrado(PartidoCerradoCreateDTO cerradoDto){

        User organizador=autentificarUser();

        if (!reservaExiste(cerradoDto.canchaId(),
                           cerradoDto.fechaPartido(),
                           cerradoDto.horaPartido())) {
            throw new IllegalStateException("No se encuentra reserva para la cancha y franja horaria");

        }


        PartidoCerrado partido = new PartidoCerrado(
            cerradoDto.canchaId(),
            cerradoDto.fechaPartido(),
            cerradoDto.horaPartido(),
            cerradoDto.equipo1(),
            cerradoDto.equipo2()
        );
        partido.setORganizador(organizador);
        partido.setEmailOrganizador(organizador.getEmail());

        PartidoCerrado partidoGuardadoC= partidoRepository.save(partido);
        envioDeEmailPorCreacion(organizador.getEmail(), partidoGuardadoC, "Cerrado");
        return partidoGuardadoC;

    }



    public List<Partido> obtenerTodosLosPartidos(){
        return partidoRepository.findAll();
    }


    public List<PartidoAbierto> obtenerPartidosAbiertos(){
        return partidoRepository.findAll()
                .stream()
                .filter(p->p instanceof PartidoAbierto)
                .map(p -> (PartidoAbierto) p)
                .toList();
    }

    @Transactional
    public List<PartidoAbiertoResponseDTO> obtenerPartidosAbiertosIncluyendoInscripcion(Long userId) {
        return obtenerPartidosAbiertos().stream()
                .map(pa -> PartidoAbiertoResponseDTO.fromEntity(pa, userId))
                .toList();
    }

    public List<PartidoCerrado> obtenerPartidoCerrados(){
        return partidoRepository.findAll()
                .stream()
                .filter(p->p instanceof PartidoCerrado)
                .map(p -> (PartidoCerrado) p)
                .toList();
    }

    public List<PartidoAbierto> historialPartidosAbiertosPorUsuario(Long userId){
        return partidoRepository.findPartidosAbiertosByOrganizadorId(userId);
    }

    public List<PartidoCerrado> historialPartidosCerradosPorUsuario(Long userId){
        return partidoRepository.findPartidosCerradosByOrganizadorId(userId);
    }

    public Optional<Partido> obtenerPartidoPorIdpartido(Long idpartido){
        return partidoRepository.findById(idpartido);
    }

    public void eliminarPartido(Long idpartido){
        partidoRepository.deleteById(idpartido);
    }
    @Transactional
    public void inscribirAAbierto(Long partidoId, Long userId) {
        PartidoAbierto partido = (PartidoAbierto) partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if (!partido.hayCupos()) {
            throw new IllegalStateException("No hay cupos disponibles para este partido.");
        }
        if (partido.getJugadores().contains(user)) {
            throw new IllegalStateException("El usuario ya está inscripto en este partido.");
        }

        partido.inscribirJugador(user);

        if (partido.getJugadores().size() >= partido.getMinJugadores()) {
            partido.setPartidoConfirmado(true);
        }

        partidoRepository.save(partido);

        emailService.sendInscripcionPartido(
                user.getEmail(),
                String.valueOf(partido.getNroCancha()),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }

    @Transactional
    public void desinscribirDeAbierto(Long partidoId, Long userId) {
        PartidoAbierto partido = (PartidoAbierto) partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        boolean yaEmpezo = partido.getFechaPartido().isBefore(hoy)
                || (partido.getFechaPartido().isEqual(hoy) && partido.getHoraPartido().isBefore(ahora));

        if (partido.isPartidoConfirmado() || yaEmpezo) {
            throw new IllegalStateException("No se puede dar de baja, el partido ya está confirmado o comenzó.");
        }
        if (!partido.getJugadores().contains(user)) {
            throw new IllegalStateException("El usuario no está inscripto en este partido.");
        }
        partido.desinscribirJugador(user);
        partidoRepository.save(partido);

        emailService.sendDesinscripcionPartido(
                user.getEmail(),
                String.valueOf(partido.getNroCancha()),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }



}
