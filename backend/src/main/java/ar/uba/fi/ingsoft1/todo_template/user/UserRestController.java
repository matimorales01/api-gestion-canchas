package ar.uba.fi.ingsoft1.todo_template.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;


import ar.uba.fi.ingsoft1.todo_template.user.dtos.UserCreateDTO;

import java.util.Map;

@RestController
@RequestMapping("/users")
@Tag(name = "1 - Users")
public class UserRestController {
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Create a new user")
    public ResponseEntity<Void> signUp(
            @Valid @NonNull @RequestBody UserCreateDTO data
    ) throws MethodArgumentNotValidException {
        userService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Message", "Usuario creado exitosamente")
                .build();
    }


    @GetMapping("/me")
    @Operation(summary = "Get current logged-in user's name and email")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal JwtUserDetails jwtUser) {
        if (jwtUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(jwtUser.id());
        User user = userService.obtenerUsuarioPorId(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Map<String, String> dto = Map.of(
                "nombre", user.getNombre(),
                "email", user.getEmail()
        );
        return ResponseEntity.ok(dto);
    }

}
