package ar.uba.fi.ingsoft1.todo_template.torneo;

import jakarta.persistence.*;
import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoDTO;

@Entity
@Table(
    name = "torneos",
    uniqueConstraints = @UniqueConstraint(columnNames = "nombre")
)
public class Torneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TorneoFormato formato;

    @Column(name = "cantidad_maxima_equipos", nullable = false)
    private Integer cantidadMaximaEquipos;

    public Torneo() {}

    public Torneo(
        String nombre,
        LocalDate fechaInicio,
        TorneoFormato formato,
        Integer cantidadMaximaEquipos
    ) {
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.formato = formato;
        this.cantidadMaximaEquipos = cantidadMaximaEquipos;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public TorneoFormato getFormato() { return formato; }
    public void setFormato(TorneoFormato formato) { this.formato = formato; }

    public Integer getCantidadMaximaEquipos() { return cantidadMaximaEquipos; }
    public void setCantidadMaximaEquipos(Integer cantidadMaximaEquipos) { this.cantidadMaximaEquipos = cantidadMaximaEquipos; }

    public TorneoDTO toDTO() {
        return new TorneoDTO(
            id,
            nombre,
            fechaInicio,
            formato,
            cantidadMaximaEquipos
        );
    }
}
