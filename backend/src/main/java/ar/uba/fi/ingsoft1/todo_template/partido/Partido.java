package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;

@Entity
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name="tipo_partido")
public class Partido {

    @EmbeddedId
    private PartidoId idPartido;

    @MapsId("canchaId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "cancha_id")
    private Cancha cancha;

    @Column(nullable = false)
    private int cantJugadoresActuales = 0;

    @Column(nullable = false)
    private String emailOrganizador;

    @ManyToOne
    @JoinColumn(name="organizador_id", nullable = false)
    private User organizador;

    //PartidoAbierto
    @Column(nullable = true)
    private int minJugadores;

    @Column(nullable = true)
    private int maxJugadores;

    @Column(nullable = false)
    private int cuposDisponibles;

    private boolean partidoConfirmado = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "partido_abierto_inscriptos",
            joinColumns = { @JoinColumn(name = "cancha_id",referencedColumnName = "cancha_id"),
                            @JoinColumn(name = "fecha_partido", referencedColumnName = "fecha_partido"),
                            @JoinColumn(name = "hora_partido", referencedColumnName = "hora_partido") },
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> jugadores = new ArrayList<>();
    //PA
    //PC
    @Column(nullable = true)
    private String equipo1;

    @Column(nullable = true)
    private String equipo2;
    //PC

    @Enumerated(EnumType.STRING)
    private TipoPartido tipoPartido;


    public Partido() {}

    public PartidoId getIdPartido(){
        return this.idPartido;  

    }   

    public void setIdPartido(PartidoId idPartido) {
        this.idPartido = idPartido;
    }
    public Cancha getCancha() {
        return this.cancha;
    }

    public void setCancha(Cancha cancha) {
        this.cancha = cancha;
    }

    public LocalDate getFechaPartido() {
        return idPartido!= null ? idPartido.getFechaPartido() : null;
    }

    public LocalTime getHoraPartido() {
        return idPartido != null ? idPartido.getHoraPartido() : null;
    }

    public TipoPartido getTipoPartido() {
        return tipoPartido;
    }
    public void setTipoPartido(TipoPartido tipoPartido) {
        this.tipoPartido = tipoPartido;
    }
    //pc
    public String getEquipo1() {
        return this.equipo1;
    }
    public void setEquipo1(String equipo1) {
        this.equipo1 = equipo1;
    }
    public String getEquipo2() {
        return this.equipo2;
    }
    public void setEquipo2(String equipo2) {
        this.equipo2 = equipo2;
    }
    //pc

    //PA
    public int getMinJugadores() {
        return minJugadores;
    }
    public void setMinJugadores(int minJugadores) {
        this.minJugadores = minJugadores;
    }
    public int getMaxJugadores() {
        return maxJugadores;
    }
    public void setMaxJugadores(int maxJugadores) {
        this.maxJugadores = maxJugadores;
    }
    public int getCuposDisponibles() {
        return cuposDisponibles;
    }
    public void setCuposDisponibles(int cuposDisponibles) {
        this.cuposDisponibles = cuposDisponibles;
    }
    public List<User> getJugadores() {
        return jugadores;
    }
    public void setJugadores(List<User> jugadores) {
        this.jugadores = jugadores;
    }
    public boolean hayCupos() {
        return cuposDisponibles > 0;
    }
    public boolean inscribirJugador(User user) {
        if (!jugadores.contains(user) && hayCupos()) {
            jugadores.add(user);
            cuposDisponibles--;
            return true;
        }
        return false;
    }
    public boolean desinscribirJugador(User user) {
        if (jugadores.contains(user)) {
            jugadores.remove(user);
            cuposDisponibles++;
            return true;
        }
        return false;
    }
    public boolean isPartidoConfirmado() {
        return partidoConfirmado;
    }
    public void setPartidoConfirmado(boolean partidoConfirmado) {
        this.partidoConfirmado = partidoConfirmado;
    }
    //PA

    public int getCantJugadoresActuales() {
        return this.cantJugadoresActuales;
    }

    public void setCantJugadoresActuales(int cantJugadoresActuales) {
        this.cantJugadoresActuales = cantJugadoresActuales;
    }

    public String getEmailOrganizador() {
        return this.emailOrganizador;
    }

    public void setEmailOrganizador(String emailOrganizador) {
        this.emailOrganizador = emailOrganizador;
    }

    public User getOrganizador() {
        return organizador;
    }

    public void setOrganizador(User organizador) {
        this.organizador = organizador;
    }
}
