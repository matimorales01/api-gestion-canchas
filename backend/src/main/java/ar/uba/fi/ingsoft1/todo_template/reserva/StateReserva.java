package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class StateReserva {
    @Column(nullable = false)
    private String state = "DISPONIBLE";

    @Column(nullable = true)
    private TipoPartido tipoPartido = null;
    
    @Column(nullable = true)
    private String emailOrganizador = null;
    

    public String getState() {
        return state;
    }   
    

    public TipoPartido getTipoPartido() {
        return tipoPartido;
    }

    public String getOrganizadorEmail() {
        return emailOrganizador;
    }

    public StateReserva changeState(Partido partido) {
        if (partido == null) {
            this.state = "DISPONIBLE";
            this.tipoPartido = null;
            this.emailOrganizador = null;
            
            return this;
        }

        TipoPartido tipo = tipoPartido != null ? tipoPartido : null;
        String email = partido.getOrganizador().getEmail();

        this.tipoPartido = tipo;
        this.emailOrganizador = email;
        this.state = "OCUPADA";

        return this;
    }
}
