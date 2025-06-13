package ar.uba.fi.ingsoft1.todo_template.partido;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;

import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaId;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaRepository;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.EmailService;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;

import jakarta.transaction.Transactional;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class PartidoService {
    private final PartidoRepository partidoRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final PartidoFactory partidoFactory;

    public PartidoService(
            PartidoRepository partidoRepository,
            EmailService emailService,
            UserRepository userRepository,
            ReservaRepository reservaRepository,
            CanchaRepository canchaRepository,
            PartidoFactory partidoFactory
    ) {
        this.partidoRepository = partidoRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.reservaRepository = reservaRepository;
        this.canchaRepository = canchaRepository;
        this.partidoFactory = partidoFactory;
    }

    private User autentificarUser() {
        JwtUserDetails infoUser = (JwtUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String emailUser = infoUser.email();

        User organizador = userRepository.findByEmail(emailUser)
                .orElseThrow(() -> new NotFoundException("El email no está registrado"));

        if (!organizador.getState()) {
            throw new IllegalStateException("Antes de crear un partido debe estar registrado");
        }
        return organizador;
    }

    private boolean reservaExiste(Long canchaId, LocalDate fecha, LocalTime horaInicio) {
        LocalTime horaFin = horaInicio.plusHours(1);
        Cancha cancha = canchaRepository.findById(canchaId)
                .orElseThrow(() -> new NotFoundException("Cancha no encontrada"));
        ReservaId reservaId = new ReservaId(cancha, fecha, horaInicio, horaFin);
        return (reservaRepository.existsById(reservaId));
    }

    private void envioDeEmailPorCreacion(String email, Partido partido) {
        emailService.sendCreationPartido(
                email,
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString(),
                partido.getTipoPartido().name()
        );
    }

    @Transactional
    public Partido crearPartido(PartidoCreateDTO partidoDto) {
        User organizador = autentificarUser();

        if (!reservaExiste(partidoDto.canchaId(),
                partidoDto.fechaPartido(),
                partidoDto.horaPartido())) {
            throw new IllegalStateException("No se encuentra reserva para la cancha y franja horaria");
        }

        Cancha cancha = canchaRepository.findById(partidoDto.canchaId())
                .orElseThrow(() -> new NotFoundException("Cancha no encontrada"));

        Partido partido = partidoFactory.crearPartido(partidoDto, cancha, organizador);

        Partido partidoGuardado = partidoRepository.save(partido);
        envioDeEmailPorCreacion(organizador.getEmail(), partidoGuardado);
        return partidoGuardado;
    }
   
    public List<Partido> obtenerTodosLosPartidos() {
        return partidoRepository.findAll();
    }

    public List<Partido> obtenerPartidosAbiertos() {
        return partidoRepository.findAll()
                .stream()
                .filter(p -> p.getTipoPartido() == TipoPartido.ABIERTO)
                .toList();
    }

    @Transactional
    public List<PartidoAbiertoResponseDTO> obtenerPartidosAbiertosIncluyendoInscripcion(Long userId) {
        return obtenerPartidosAbiertos().stream()
                .map(pa -> PartidoAbiertoResponseDTO.fromEntity(pa, userId))
                .toList();
    }

    public List<Partido> obtenerPartidoCerrados() {
        return partidoRepository.findAll()
                .stream()
                .filter(p -> p.getTipoPartido() == TipoPartido.CERRADO)
                .toList();
    }

    @Transactional
    public List<Partido> historialPartidosAbiertosPorUsuario(Long userId) {
        List<Partido> partidos = partidoRepository.findByTipoPartidoAndOrganizadorId(TipoPartido.ABIERTO, userId);
        for (Partido partido : partidos) {
            partido.getJugadores().size();
        }
        return partidos;
    }

    @Transactional
    public List<Partido> historialPartidosCerradosPorUsuario(Long userId) {
        return partidoRepository.findByTipoPartidoAndOrganizadorId(TipoPartido.CERRADO, userId);
    }

    /*public Optional<Partido> obtenerPartidoPorIdpartido(Long idpartido) {
        return partidoRepository.findById(idpartido);
    }

    public void eliminarPartido(Long idpartido) {
        partidoRepository.deleteById(idpartido);
    }*/

    public Optional<Partido> obtenerPartidoPorIdpartido(PartidoId idpartido) {
        return partidoRepository.findById(idpartido);
    }

    public void eliminarPartido(PartidoId idpartido) {
        partidoRepository.deleteById(idpartido);
    }

    @Transactional
    public void inscribirAAbierto(PartidoId partidoId, Long userId) {
        Partido partido =partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));
        
        
        if (partido.getTipoPartido() != TipoPartido.ABIERTO) {
            throw new IllegalStateException("El partido no es de tipo abierto.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if(!partido.inscribirJugador(user)) {
            throw new IllegalStateException("No hay cupos disponibles o el usuario ya está inscripto.");
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
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }

    @Transactional
    public void desinscribirDeAbierto(PartidoId partidoId, Long userId) {
        Partido partido =  partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));
        
        if (partido.getTipoPartido() != TipoPartido.ABIERTO) {
            throw new IllegalStateException("El partido no es de tipo abierto.");
        }        
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        boolean yaEmpezo = partido.getFechaPartido().isBefore(hoy)
                || (partido.getFechaPartido().isEqual(hoy) && partido.getHoraPartido().isBefore(ahora));

        if (partido.isPartidoConfirmado() || yaEmpezo) {
            throw new IllegalStateException("No se puede dar de baja, el partido ya está confirmado o comenzó.");
        }
        /*if (!partido.getJugadores().contains(user)) {
            throw new IllegalStateException("El usuario no está inscripto en este partido.");
        }*/
        if (!partido.desinscribirJugador(user)) {
            throw new IllegalStateException("El usuario no está inscripto en este partido.");   
            
        }
        //partido.desinscribirJugador(user);
        partidoRepository.save(partido);

        emailService.sendDesinscripcionPartido(
                user.getEmail(),
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }
}
