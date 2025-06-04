package ar.uba.fi.ingsoft1.todo_template.partido;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("ABIERTO")
public class PartidoAbierto extends Partido {

    @Column(nullable = true)
    private int minJugadores;

    @Column(nullable = true)
    private int maxJugadores;

    @Column(nullable = false)
    private int cuposDisponibles;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "partido_abierto_inscriptos",
            joinColumns = @JoinColumn(name = "partido_abierto_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> jugadores = new ArrayList<>();

    public PartidoAbierto() {}

    public PartidoAbierto(Long canchaId,
                          LocalDate fechaPartido, LocalTime horaPartido,
                          int minJugadores, int maxJugadores, int cuposDisponibles) {
        super(canchaId, fechaPartido, horaPartido);
        this.minJugadores = minJugadores;
        this.maxJugadores = maxJugadores;
        this.cuposDisponibles = cuposDisponibles;
    }

    public int getMinJugadores() {
        return minJugadores;
    }
    public void setMinJugadores(int minJugadores) {
        this.minJugadores = minJugadores;
    }

    public int getMaxJugadores() {
        return maxJugadores;
    }
    public void setMaxJugadores(int maxJugadores) {
        this.maxJugadores = maxJugadores;
    }

    public int getCuposDisponibles() {
        return cuposDisponibles;
    }
    public void setCuposDisponibles(int cuposDisponibles) {
        this.cuposDisponibles = cuposDisponibles;
    }

    public List<User> getJugadores() {
        return jugadores;
    }
    public void setJugadores(List<User> jugadores) {
        this.jugadores = jugadores;
    }

    public boolean hayCupos() {
        return cuposDisponibles > 0;
    }

    public boolean inscribirJugador(User user) {
        if (!jugadores.contains(user) && hayCupos()) {
            jugadores.add(user);
            cuposDisponibles--;
            return true;
        }
        return false;
    }

    public boolean desinscribirJugador(User user) {
        if (jugadores.contains(user)) {
            jugadores.remove(user);
            cuposDisponibles++;
            return true;
        }
        return false;
    }

    @Override
    public String getTipoPartido() {
        return "Abierto";
    }
}
