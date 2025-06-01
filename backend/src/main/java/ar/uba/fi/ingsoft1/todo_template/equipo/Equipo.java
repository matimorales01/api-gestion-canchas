package ar.uba.fi.ingsoft1.todo_template.equipo;

import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Equipo {
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String teamName;

    @Column(nullable = false)
    private User captain;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String mainColors;

    @Column(nullable = true)
    private String secondaryColors;

    public Equipo() {}

    public Equipo(String teamName, User captain, String category, String mainColors, String secondaryColors) {
        this.teamName = teamName;
        this.captain = captain;
        this.category = category;
        this.mainColors = mainColors;
        this.secondaryColors = secondaryColors;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public User getCaptain() {
        return captain;
    }

    public EquipoDTO asEquipoDTO() {
        return new EquipoDTO(id, teamName, category, mainColors, secondaryColors, captain.getId());
    }
}
