package ar.uba.fi.ingsoft1.todo_template.reserva;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cancha_id")
    private Cancha cancha;

    @Column(nullable = false)
    private State state;

    @ManyToOne(optional = true)
    @JoinColumn(name = "usuario_id")
    private User usuarioCancha;

    @Column(nullable = true)
    private String partido;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime inicioTurno;

    @Column(nullable = false)
    private LocalTime finTurno;

    public Reserva(){}
    public Reserva(Cancha cancha, State state, User user, String partido, LocalDate fecha, LocalTime inicioTurno, LocalTime finTurno) {
        this.cancha = cancha;
        this.state = state;
        this.usuarioCancha = user;
        this.partido = partido;
        this.fecha = fecha;
        this.inicioTurno = inicioTurno;
        this.finTurno = finTurno;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cancha getCancha() { return cancha; }
    public void setCancha(Cancha cancha) { this.cancha = cancha; }

    public State getState() { return state; }
    public void setState(State state) { this.state = state; }

    public User getUsuarioCancha() { return usuarioCancha; }
    public void setUsuarioCancha(User usuarioCancha) { this.usuarioCancha = usuarioCancha; }

    public String getPartido() { return partido; }
    public void setPartido(String partido) { this.partido = partido; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getInicioTurno() { return inicioTurno; }
    public void setInicioTurno(LocalTime inicioTurno) { this.inicioTurno = inicioTurno; }

    public LocalTime getFinTurno() { return finTurno; }
    public void setFinTurno(LocalTime finTurno) { this.finTurno = finTurno; }

    public ReservaDTO toReservaDTO() {
        return new ReservaDTO(this.id, this.cancha.getId(), this.state, this.usuarioCancha.getId(), this.partido, this.fecha, this.inicioTurno, this.finTurno);
    }
}
