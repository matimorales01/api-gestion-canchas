package ar.uba.fi.ingsoft1.todo_template.canchas.dto;

import jakarta.validation.constraints.NotBlank;

public class CanchaCreateDTO {
    @NotBlank private String nombre;
    @NotBlank private String tipoCesped;
    private boolean iluminacion;
    @NotBlank private String zona;
    @NotBlank private String direccion;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipoCesped() { return tipoCesped; }
    public void setTipoCesped(String tipoCesped) { this.tipoCesped = tipoCesped; }
    public boolean isIluminacion() { return iluminacion; }
    public void setIluminacion(boolean iluminacion) { this.iluminacion = iluminacion; }
    public String getZona() { return zona; }
    public void setZona(String zona) { this.zona = zona; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}
