package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.EstadoTorneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public class TorneoUpdateDTO {
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private TorneoFormato formato;
    private Integer cantidadMaximaEquipos;
    private String descripcion;
    private String premios;
    private Double costoInscripcion;
    private EstadoTorneo estado;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public TorneoFormato getFormato() { return formato; }
    public void setFormato(TorneoFormato formato) { this.formato = formato; }

    public Integer getCantidadMaximaEquipos() { return cantidadMaximaEquipos; }
    public void setCantidadMaximaEquipos(Integer cantidadMaximaEquipos) { this.cantidadMaximaEquipos = cantidadMaximaEquipos; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getPremios() { return premios; }
    public void setPremios(String premios) { this.premios = premios; }

    public Double getCostoInscripcion() { return costoInscripcion; }
    public void setCostoInscripcion(Double costoInscripcion) { this.costoInscripcion = costoInscripcion; }

    public EstadoTorneo getEstado() { return estado; }
    public void setEstado(EstadoTorneo estado) { this.estado = estado; }
}
