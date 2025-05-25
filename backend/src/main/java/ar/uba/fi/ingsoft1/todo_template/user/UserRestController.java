package ar.uba.fi.ingsoft1.todo_template.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.user.dtos.TokenDTO;
import ar.uba.fi.ingsoft1.todo_template.user.dtos.UserCreateDTO;

@RestController
@RequestMapping("/users")
@Tag(name = "1 - Users")
class UserRestController {
    private final UserService userService;

    UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Create a new user")
    @ResponseStatus(HttpStatus.CREATED)
    ResponseEntity<TokenDTO> signUp(
            @Valid @NonNull @RequestBody UserCreateDTO data
    ) throws MethodArgumentNotValidException {
        try {
            return userService.createUser(data)
                    .map(tk -> ResponseEntity.status(HttpStatus.CREATED).body(tk))
                    .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    
}
