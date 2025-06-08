package ar.uba.fi.ingsoft1.todo_template.torneo;

import jakarta.persistence.*;
import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoDTO;

@Entity
@Table(name = "torneos", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Torneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TorneoFormato format;

    @Column(name = "max_teams", nullable = false)
    private Integer maxTeams;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String prizes;

    @Column(name = "registration_fee")
    private Double registrationFee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTorneo state = EstadoTorneo.ABIERTO;

    @ManyToOne(optional = false)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    public Torneo() {}

    public Torneo(
        String name,
        LocalDate startDate,
        TorneoFormato format,
        Integer maxTeams,
        LocalDate endDate,
        String description,
        String prizes,
        Double registrationFee
    ) {
        this.name = name;
        this.startDate = startDate;
        this.format = format;
        this.maxTeams = maxTeams;
        this.endDate = endDate;
        this.description = description;
        this.prizes = prizes;
        this.registrationFee = registrationFee;
        this.state = EstadoTorneo.ABIERTO;
       
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public TorneoFormato getFormat() { return format; }
    public void setFormat(TorneoFormato format) { this.format = format; }

    public Integer getMaxTeams() { return maxTeams; }
    public void setMaxTeams(Integer maxTeams) { this.maxTeams = maxTeams; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrizes() { return prizes; }
    public void setPrizes(String prizes) { this.prizes = prizes; }

    public Double getRegistrationFee() { return registrationFee; }
    public void setRegistrationFee(Double registrationFee) { this.registrationFee = registrationFee; }

    public EstadoTorneo getState() { return state; }
    public void setState(EstadoTorneo state) { this.state = state; }

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public TorneoDTO toDTO() {
        return new TorneoDTO(
            id,
            name,
            startDate,
            endDate,
            format,
            maxTeams,
            description,
            prizes,
            registrationFee,
            state,
            organizer.getId()
        );
    }
}
