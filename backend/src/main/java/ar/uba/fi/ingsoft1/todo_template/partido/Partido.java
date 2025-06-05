package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;

@Entity(name = "partido")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo_partido")
public abstract class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cancha_id")
    private Cancha cancha;

    @Column(nullable = true)
    private LocalDate fechaPartido;

    @Column(nullable = false)
    private LocalTime horaPartido;

    @Column(nullable = false)
    private int cantJugadoresActuales = 0;

    @Column(nullable = false)
    private String emailOrganizador;

    @ManyToOne
    @JoinColumn(name="organizador_id", nullable = false)
    private User organizador;

    public Partido() {}

    public Partido(Cancha cancha, LocalDate fechaPartido, LocalTime horaPartido) {
        this.cancha = cancha;
        this.fechaPartido = fechaPartido;
        this.horaPartido = horaPartido;
        this.cantJugadoresActuales = 0;
    }

    public abstract String getTipoPartido();

    public Long getIdPartido() {
        return this.idPartido;
    }

    public Cancha getCancha() {
        return this.cancha;
    }

    public void setCancha(Cancha cancha) {
        this.cancha = cancha;
    }

    public LocalDate getFechaPartido() {
        return this.fechaPartido;
    }

    public void setFechaPartido(LocalDate fechaPartido) {
        this.fechaPartido = fechaPartido;
    }

    public LocalTime getHoraPartido() {
        return this.horaPartido;
    }

    public void setHoraPartido(LocalTime horaPartido) {
        this.horaPartido = horaPartido;
    }

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
