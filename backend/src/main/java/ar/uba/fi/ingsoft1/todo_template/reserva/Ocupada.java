package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Ocupada implements StateReserva {

    @Column(nullable = false)
    private final String state = "OCUPADA";

    @Column(nullable = true)
    private TipoPartido tipoPartido;

    @Column(nullable = true)
    private String emailOrganizador;

    public Ocupada(TipoPartido tipoPartido, String emailOrganizador) {
        this.tipoPartido = tipoPartido;
        this.emailOrganizador = emailOrganizador;
    }

    @Override
    public String getState() {
        return state;
    }

    @Override
    public TipoPartido getTipoPartido() {
        return tipoPartido;
    }

    @Override
    public String getOrganizadorEmail() {
        return emailOrganizador;
    }

    @Override
    public StateReserva changeState(Partido partido) {
        if (partido == null) {
            return this;
        }

        return new Disponible();
    }
    
}
