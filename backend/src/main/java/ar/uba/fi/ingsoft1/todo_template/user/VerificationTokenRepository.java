package ar.uba.fi.ingsoft1.todo_template.user;

import org.springframework.data.jpa.repository.JpaRepository;

interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
}

