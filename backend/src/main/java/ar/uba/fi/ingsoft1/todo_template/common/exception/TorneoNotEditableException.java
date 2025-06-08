package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TorneoNotEditableException extends RuntimeException {
    public TorneoNotEditableException(Long id) {
        super(String.format("No se puede editar el torneo con id %d porque no está en estado ABIERTO.", id));
    }
}
