package ar.uba.fi.ingsoft1.todo_template.user.dtos;

import jakarta.validation.constraints.NotBlank;

import java.util.Optional;
import java.util.function.Function;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserCredentials;

public record UserCreateDTO(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        Optional<String> genre,
        Optional<Integer> age,
        Optional<String> zone
) implements UserCredentials {
    public User asUser(Function<String, String> encryptPassword) {
        return new User(username, encryptPassword.apply(password), email, firstName, lastName, genre, age, zone);
    }
}
