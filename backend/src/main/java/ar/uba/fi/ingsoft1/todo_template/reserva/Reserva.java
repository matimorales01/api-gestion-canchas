package ar.uba.fi.ingsoft1.todo_template.reserva;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;

@Entity
@Table(name = "reservas")
public class Reserva {
    @EmbeddedId
    private ReservaId reservaId;

    @Column(nullable = false)
    private String state;

    @Column(nullable = true)
    private String partido;

    public Reserva() {}

    public Reserva(ReservaId reservaId, String state, String partido) {
        this.reservaId = reservaId;
        this.state = state;
        this.partido = partido;
    }

    public Cancha getCancha() { return reservaId.getCanchaId(); }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPartido() { return partido; }
    public void setPartido(String partido) { this.partido = partido; }

    public LocalDate getFecha() { return reservaId.getFecha(); }

    public LocalTime getHoraInicio() { return reservaId.getHoraInicio(); }

    public LocalTime getHoraFin() { return reservaId.getHoraFin(); }

    public ReservaDTO toDTO() {
        return new ReservaDTO(
            this.reservaId.getCanchaId().getNombre(),
            this.reservaId.getFecha(),
            this.reservaId.getHoraInicio(),
            this.reservaId.getHoraFin(),
            this.state,
            this.partido
        );
    }
}
