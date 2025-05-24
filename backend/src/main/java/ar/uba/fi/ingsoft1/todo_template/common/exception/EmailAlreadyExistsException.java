package ar.uba.fi.ingsoft1.todo_template.common.exception;

public class EmailAlreadyExistsException extends Exception {
    public EmailAlreadyExistsException(String email) {
        super(String.format("User with email %s already exists", email));
    }
}
