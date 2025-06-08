package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;
import ar.uba.fi.ingsoft1.todo_template.torneo.EstadoTorneo;

public class TorneoUpdateDTO {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private TorneoFormato format;
    private Integer maxTeams;
    private String description;
    private String prizes;
    private Double registrationFee;
    private EstadoTorneo state;

    public String getName() { return name; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public TorneoFormato getFormat() { return format; }
    public Integer getMaxTeams() { return maxTeams; }
    public String getDescription() { return description; }
    public String getPrizes() { return prizes; }
    public Double getRegistrationFee() { return registrationFee; }
    public EstadoTorneo getState() { return state; }

    public void setName(String name) { this.name = name; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setFormat(TorneoFormato format) { this.format = format; }
    public void setMaxTeams(Integer maxTeams) { this.maxTeams = maxTeams; }
    public void setDescription(String description) { this.description = description; }
    public void setPrizes(String prizes) { this.prizes = prizes; }
    public void setRegistrationFee(Double registrationFee) { this.registrationFee = registrationFee; }
    public void setState(EstadoTorneo state) { this.state = state; }
}
