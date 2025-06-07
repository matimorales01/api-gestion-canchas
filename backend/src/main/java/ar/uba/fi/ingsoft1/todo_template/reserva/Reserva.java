package ar.uba.fi.ingsoft1.todo_template.reserva;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;

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

    @Column(nullable = true)
    private String partido;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime inicioTurno;

    @Column(nullable = false)
    private LocalTime finTurno;

    public Reserva(){}
    public Reserva(Cancha cancha, State state, String partido, LocalDate fecha, LocalTime inicioTurno, LocalTime finTurno) {
        this.cancha = cancha;
        this.state = state;
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

    public String getPartido() { return partido; }
    public void setPartido(String partido) { this.partido = partido; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getInicioTurno() { return inicioTurno; }
    public void setInicioTurno(LocalTime inicioTurno) { this.inicioTurno = inicioTurno; }

    public LocalTime getFinTurno() { return finTurno; }
    public void setFinTurno(LocalTime finTurno) { this.finTurno = finTurno; }

    public ReservaDTO toReservaDTO() {
        return new ReservaDTO(this.cancha.getNombre(), this.state, this.partido == null ? null : this.partido, this.fecha, this.inicioTurno, this.finTurno);
    }
}
