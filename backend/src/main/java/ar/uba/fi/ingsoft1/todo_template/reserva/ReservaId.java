package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class ReservaId implements Serializable {

    @ManyToOne
    @JoinColumn(name = "cancha_id", nullable = false)
    private Cancha canchaId;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    public ReservaId(Cancha canchaId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        this.canchaId = canchaId;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        
        if (!(other instanceof ReservaId)) return false;
        
        ReservaId that = (ReservaId) other;
        return canchaId.equals(that.canchaId) &&
               fecha.equals(that.fecha) &&
               horaInicio.equals(that.horaInicio) &&
               horaFin.equals(that.horaFin);
    }

    @Override
    public int hashCode() {
        return Objects.hash(canchaId, fecha, horaInicio, horaFin);
    }

    public Cancha getCanchaId() {
        return canchaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }
}
