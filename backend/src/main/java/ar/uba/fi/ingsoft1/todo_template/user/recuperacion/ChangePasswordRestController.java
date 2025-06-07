package ar.uba.fi.ingsoft1.todo_template.user.recuperacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.ChangePasswordDTO;
import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.EmailDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/change-password")
public class ChangePasswordRestController {
    @Autowired
    private ResetService resetService;

    @PostMapping()
    public ResponseEntity<String> postMethodName(@RequestBody EmailDTO email) {
        String msg = resetService.createResetToken(email);
        
        return ResponseEntity.ok(msg);
    }
    
    @PostMapping("/{token}")
    public ResponseEntity<String> postMethodName(@PathVariable String token, @RequestBody ChangePasswordDTO changePasswordDTO) {
        String msg = resetService.changePassword(token, changePasswordDTO);
        return ResponseEntity.ok(msg);
    }
}
