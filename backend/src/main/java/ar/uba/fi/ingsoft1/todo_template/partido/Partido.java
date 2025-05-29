package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.persistence.*;;

@Entity(name = "partido")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo_partido")
public abstract class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;
    
    @Column(nullable = true)
    private Long nroCancha;

    @Column(nullable = true)
    private String fechaPartido;

    @Column(nullable = false)
    private String horaPartido;

    @Column(nullable = false)
    private int cantJugadoresActuales=0;

    @Column(nullable = false)
    private String emailOrganizador;

    @ManyToOne
    @JoinColumn(name="organizador_id", nullable = false)
    private User organizador;
    
    

    

    public Partido() {}

    public Partido(Long nroCancha,String fechaPartido,String horaPartido, String emailOrganizador) {
        
        this.nroCancha=nroCancha;
        this.fechaPartido=fechaPartido;
        this.horaPartido=horaPartido;
        this.emailOrganizador=emailOrganizador;
        this.cantJugadoresActuales=0;
    }

    public abstract String getTipoPartido();

    public Long getIdPartido() {
        return this.idPartido;
    }

    public Long getNroCancha() {
        return this.nroCancha;
    }
    public void setNroCancha(Long nroCancha){
        this.nroCancha=nroCancha;
    }

    public String getFechaPartido() {
        return this.fechaPartido;
    }
    public void setFechaPartido(String fechaPartido) {
        this.fechaPartido = fechaPartido;
    }    

    public String getHoraPartido() {
        return this.horaPartido;
    }
    public void setHoraPartido(String horaPartido) {
        this.horaPartido = horaPartido;
    }
    
    public int getCantJugadoresActuales(){
        return this.cantJugadoresActuales;
    }

    public void setCantJugadoresActuales(int cantJugadoresActuales) { 
        this.cantJugadoresActuales = cantJugadoresActuales;
    }
    public String getEmailOrganizador() {
        return this.emailOrganizador;
    }

    public void setEmailOrganizador(String emailOrganizador) {
        this.emailOrganizador = emailOrganizador;
    }

    public User getOrganizador(){
        return organizador;
    }
    public void setORganizador(User organizador){
        this.organizador=organizador;
    }
}
