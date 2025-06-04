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
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cancha getCancha() { return cancha; }
    public void setCancha(Cancha cancha) { this.cancha = cancha; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public ReservaDTO toReservaDTO() {
        return new ReservaDTO(id, cancha.getId(), fecha, horaInicio, horaFin);
    }
}
