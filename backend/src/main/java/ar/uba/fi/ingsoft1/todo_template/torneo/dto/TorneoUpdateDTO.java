package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public class TorneoUpdateDTO {
    private String nombre;
    private LocalDate fechaInicio;
    private TorneoFormato formato;
    private Integer cantidadMaximaEquipos;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public TorneoFormato getFormato() { return formato; }
    public void setFormato(TorneoFormato formato) { this.formato = formato; }

    public Integer getCantidadMaximaEquipos() { return cantidadMaximaEquipos; }
    public void setCantidadMaximaEquipos(Integer cantidadMaximaEquipos) { this.cantidadMaximaEquipos = cantidadMaximaEquipos; }
}
