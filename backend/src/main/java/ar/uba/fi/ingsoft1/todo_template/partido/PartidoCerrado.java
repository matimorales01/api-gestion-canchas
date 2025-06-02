package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.*;;

@Entity
@DiscriminatorValue("CERRADO")
public class PartidoCerrado extends Partido {

    @Column(nullable = true)
    private String equipo1;

    @Column(nullable = true)
    private String equipo2;


    public PartidoCerrado() {}

    public PartidoCerrado(Long nroCancha,String fechaPartido,String horaPartido, String equipo1, String equipo2, String emailOrganizador) {
        super(nroCancha,fechaPartido,horaPartido,emailOrganizador);
        this.equipo1=equipo1;
        this.equipo2=equipo2;
    
    }

    public String getEquipo1(){
        return this.equipo1;
    }
    public void setEquipo1(String equipo1){
        this.equipo1=equipo1;
    }

    public String getEquipo2(){
        return this.equipo2;
    }
    public void setEquipo2(String equipo2){
        this.equipo2=equipo2;
    }

    @Override
    public String getTipoPartido(){
        return "Cerrado";
    }

    
    
    
}
