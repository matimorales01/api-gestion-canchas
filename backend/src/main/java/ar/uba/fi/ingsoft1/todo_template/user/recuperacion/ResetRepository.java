package ar.uba.fi.ingsoft1.todo_template.user.recuperacion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetRepository extends JpaRepository<ResetToken, String> {

    Optional<ResetToken> findByUserId(Long userId);
    Optional<ResetToken> findByValue(String value);
}
