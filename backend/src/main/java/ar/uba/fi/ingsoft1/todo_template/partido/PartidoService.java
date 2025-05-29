package ar.uba.fi.ingsoft1.todo_template.partido;


import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaService;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UnauthorizedCanchaAccessException;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoAbiertoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCerradoCreateDTO;

import ar.uba.fi.ingsoft1.todo_template.user.EmailService;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class PartidoService {
    private final PartidoRepository partidoRepository;
    private final EmailService emailService;
    private final UserService userService;
    private final CanchaService canchaService;

    public PartidoService(
        PartidoRepository partidoRepository, 
        EmailService emailService, 
        UserService userService,
        CanchaService canchaService
        ) {
            this.partidoRepository = partidoRepository;
            this.emailService=emailService;
            this.userService=userService;
            this.canchaService=canchaService;
        }

    public Partido crearPartidoAbierto(PartidoAbiertoCreateDTO abiertoDto){
        String email=userService.obtenerEmailPorId(abiertoDto.idOrganizador());        
        User organizador =userService.obtenerUsuarioPorId(abiertoDto.idOrganizador());

        CanchaDTO cancha =canchaService.obtenerCancha(abiertoDto.nroCancha());
        if (!cancha.getPropietarioId().equals(abiertoDto.idOrganizador())) {
            throw new UnauthorizedCanchaAccessException("No eres propietario de la cancha");
            
        }
        PartidoAbierto partido=new PartidoAbierto(
            abiertoDto.nroCancha(),
            abiertoDto.fechaPartido(),
            abiertoDto.horaPartido(),
            abiertoDto.minJugadores(),
            abiertoDto.maxJugadores(),
            email
            //abiertoDto.emailOrganizador()
        );
        partido.setORganizador(organizador);

        Partido partidoGuardadoA= partidoRepository.save(partido);
        //Enviar correo de confirmacion
        //sendCreationPartido(String toEmail, String cancha, String fecha, String hora) 
        emailService.sendCreationPartido(
            //partidoGuardadoA.getEmailOrganizador(), 
            organizador.getEmail(),
            partidoGuardadoA.getNroCancha().toString(),
            partidoGuardadoA.getFechaPartido(),
            partidoGuardadoA.getHoraPartido(),
            "Abierto");
        return partidoGuardadoA;
    }


    public Partido crearPartidoCerrado(PartidoCerradoCreateDTO cerradoDTo){
        String email=userService.obtenerEmailPorId(cerradoDTo.idOrganizador());
        User organizador =userService.obtenerUsuarioPorId(cerradoDTo.idOrganizador());

        CanchaDTO cancha =canchaService.obtenerCancha(cerradoDTo.nroCancha());
        if (!cancha.getPropietarioId().equals(cerradoDTo.idOrganizador())) {
            throw new UnauthorizedCanchaAccessException("No eres propietario de la cancha");
            
        }



        PartidoCerrado partido = new PartidoCerrado(
            cerradoDTo.nroCancha(),
            cerradoDTo.fechaPartido(),
            cerradoDTo.horaPartido(),
            cerradoDTo.equipo1(),
            cerradoDTo.equipo2(),
            email
        );
        partido.setORganizador(organizador);

        Partido partidoGuardadoC= partidoRepository.save(partido);
        //Enviar correo de confirmacion
        //sendCreationPartido(String toEmail, String cancha, String fecha, String hora) 
        emailService.sendCreationPartido(
            //partidoGuardadoC.getEmailOrganizador(),
            organizador.getEmail(), 
            partidoGuardadoC.getNroCancha().toString(),
            partidoGuardadoC.getFechaPartido(),
            partidoGuardadoC.getHoraPartido(),
            "Cerrado");
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
