package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import ar.uba.fi.ingsoft1.todo_template.partido.Partido;

@Embeddable
public class Disponible implements StateReserva {
    @Column(nullable = true)
    private TipoPartido tipoPartido = null;
    
    @Column(nullable = true)
    private String emailOrganizador = null;
    
    
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

        TipoPartido tipo = tipoPartido != null ? tipoPartido : null;
        String email = partido.getOrganizador().getEmail();

        return new Ocupada(tipo, email);
    }
}
