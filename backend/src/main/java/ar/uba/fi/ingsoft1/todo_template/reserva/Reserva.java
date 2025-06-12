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
    private ReservaId id;

    @Column(nullable = false)
    private String state;

    @Column(nullable = true)
    private String partido;

    public Reserva() {}

    public Reserva(ReservaId id, String state, String partido) {
        this.id = id;
        this.state = state;
        this.partido = partido;
    }

    public Cancha getCancha() { return id.getCanchaId(); }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPartido() { return partido; }
    public void setPartido(String partido) { this.partido = partido; }

    public LocalDate getFecha() { return id.getFecha(); }

    public LocalTime getHoraInicio() { return id.getHoraInicio(); }

    public LocalTime getHoraFin() { return id.getHoraFin(); }

    public ReservaDTO toDTO() {
        return new ReservaDTO(
            this.id.getCanchaId().getNombre(),
            this.id.getFecha(),
            this.id.getHoraInicio(),
            this.id.getHoraFin(),
            this.state,
            this.partido
        );
    }
}
