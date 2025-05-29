package ar.uba.fi.ingsoft1.todo_template.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
//import jakarta.persistence.OneToMany;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

//import ar.uba.fi.ingsoft1.todo_template.partido.Partido;

import java.util.Collection;
import java.util.List;

@Entity(name = "users")
public class User implements UserDetails, UserCredentials {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique= true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = true)
    private String genre;

    @Column(nullable = true)
    private Integer age;

    @Column(nullable = true)
    private String zone;

    @Column(nullable = false)
    private boolean state;

    @Column(nullable = false)
    private String role;

    //@OneToMany(mappedBy = "organizador")
    //private List<Partido> partidosCreados;

    public User() {}

    public User(String username, String password, String email, String firstName, String lastName, String genre, Integer age, String zone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.genre = genre;
        this.age = age;
        this.zone = zone;
        this.state = false;
        this.role = "USER";
    }
    


    @Override
    public String email() {
        return this.email;
    }

    @Override
    public String password() {
        return this.password;
    }

    
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public String getEmail() {
        return email;
    }

    public Long getId(){
        return id;
    }

    public String getRole() {
        return role;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    public boolean getState() {
        return state;
    }

    /*public List<Partido> getPartidosCreados(){
       return this.partidosCreados;
    }*/

    /*public void setPartidoCreados(List<Partido> partidosCreados){
        this.partidosCreados = partidosCreados;
    }*/

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }
}
