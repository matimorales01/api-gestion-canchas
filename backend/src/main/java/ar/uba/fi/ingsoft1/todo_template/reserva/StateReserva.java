package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;


public interface StateReserva {
    TipoPartido getTipoPartido();
    String getOrganizadorEmail();
    StateReserva changeState(Partido partido);
}
