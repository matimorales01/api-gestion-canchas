package ar.uba.fi.ingsoft1.todo_template.canchas;

import jakarta.persistence.*;
import ar.uba.fi.ingsoft1.todo_template.user.User;

// en unique contraint tomo en cuenta los campos nombre, zona y direccion como si fuese Primari key
// y no se creen dos canchas con el mismo nombre, zona y direccion por lo que dice la consigna

@Entity
@Table(
    name = "canchas",
    uniqueConstraints = @UniqueConstraint(columnNames = {"nombre","zona","direccion"})
)
public class Cancha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String tipoCesped;

    @Column(nullable = false)
    private boolean iluminacion;

    @Column(nullable = false)
    private String zona;

    @Column(nullable = false)
    private String direccion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "propietario_id")
    private User propietario;

    @Column(nullable = false)
    private boolean activa = true;



    public Long getId() { return id; }
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
    public User getPropietario() { return propietario; }
    public void setPropietario(User propietario) { this.propietario = propietario; }
    public boolean getActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }
}
