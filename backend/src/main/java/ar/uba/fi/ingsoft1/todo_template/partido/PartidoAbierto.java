package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;



import jakarta.persistence.*;;

@Entity
@DiscriminatorValue("ABIERTO")
public class PartidoAbierto extends Partido {

    @Column(nullable = true)
    private int minJugadores;

    @Column(nullable = true)
    private int maxJugadores;

    //@OneToMany
    //private List<User> jugadores;


    public PartidoAbierto() {}

    public PartidoAbierto(Long nroCancha,String fechaPartido,String horaPartido, int minJugadores, int maxJugadores, String emailOrganizador) {
        super(nroCancha,fechaPartido,horaPartido,emailOrganizador);
        this.minJugadores=minJugadores;
        this.maxJugadores=maxJugadores;
        
     
    }

    public int getMinJugadores(){
        return this.minJugadores;
    }
    public void setMinJugadores(int minJugadores){
        this.minJugadores=minJugadores;
    }

    public int getMaxJugadores(){
        return this.maxJugadores;
    }
    public void setMaxJugadores(int maxJugadores){
        this.maxJugadores=maxJugadores;
    }


    @Override
    public String getTipoPartido(){
        return "Abierto";
    }
    
    
}
