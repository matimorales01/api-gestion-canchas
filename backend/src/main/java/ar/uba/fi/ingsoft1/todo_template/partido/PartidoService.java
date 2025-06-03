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
        //esta parte es para validar y tener el email del usuario
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
        //veamos si la reserva puede ser efectiva

        LocalTime horaFin=horaInicio.plusHours(1);//segun la duracion es de 1 hora 

        return(reservaRepository.existsReservaConHorarioExacto(
            canchaId, 
            fecha, 
            horaInicio, 
            horaFin));
        
        
       
    }

    private void envioDeEmailPorCreacion(String email, Partido partido, String tipo){

        //Enviar correo de confirmacion
        //sendCreationPartido(String toEmail, String cancha, String fecha, String hora) 
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
            abiertoDto.maxJugadores()
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
    public List<PartidoAbierto> obtenerPartidoAbiertos(){
        return partidoRepository.findAll()
                .stream()
                .filter(p->p instanceof PartidoAbierto)
                .map(p -> (PartidoAbierto) p)
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
}
