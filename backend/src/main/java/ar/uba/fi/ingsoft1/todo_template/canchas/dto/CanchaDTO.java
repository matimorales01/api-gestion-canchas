package ar.uba.fi.ingsoft1.todo_template.canchas.dto;

public class CanchaDTO {
    private Long id;
    private String nombre;
    private String tipoCesped;
    private boolean iluminacion;
    private String zona;
    private String direccion;
    private Long propietarioId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Long getPropietarioId() { return propietarioId; }
    public void setPropietarioId(Long propietarioId) { this.propietarioId = propietarioId; }
}
