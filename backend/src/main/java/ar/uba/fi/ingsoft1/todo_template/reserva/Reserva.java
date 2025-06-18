package ar.uba.fi.ingsoft1.todo_template.reserva;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;

@Entity
@Table(name = "reservas")
public class Reserva {
    @EmbeddedId
    private ReservaId id;

    @Column(nullable = false)
    private String state;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "cancha_id", referencedColumnName = "canchaId", nullable = true),
        @JoinColumn(name = "fecha_partido", referencedColumnName = "fecha", nullable = true),
        @JoinColumn(name = "hora_partido", referencedColumnName = "hora", nullable = true)
    })
    private Partido partido;

    public Reserva() {}

    public Reserva(ReservaId id, String state, Partido partido) {
        this.id = id;
        this.state = state;
        this.partido = partido;
    }

    public Cancha getCancha() { return id.getCanchaId(); }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Partido getPartido() { return partido; }
    public void setPartido(Partido partido) { this.partido = partido; }

    public LocalDate getFecha() { return id.getFecha(); }

    public LocalTime getHoraInicio() { return id.getHoraInicio(); }

    public LocalTime getHoraFin() { return id.getHoraFin(); }

    public ReservaDTO toDTO() {
        Cancha c = this.id.getCanchaId();

        return new ReservaDTO(
                c.getId(),
                c.getNombre(),
                c.getZona(),
                c.getDireccion(),
                this.id.getFecha(),
                this.id.getHoraInicio(),
                this.id.getHoraFin(),
                this.state,
                this.partido.getTipoPartido(),
                this.partido.getOrganizador().getEmail()
        );
    }
}
