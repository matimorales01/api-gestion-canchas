package ar.uba.fi.ingsoft1.todo_template.user;

import ar.uba.fi.ingsoft1.todo_template.common.exception.UserAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UserNotVerifiedException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.EmailAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtService;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.dtos.RefreshDTO;
import ar.uba.fi.ingsoft1.todo_template.user.dtos.TokenDTO;
import ar.uba.fi.ingsoft1.todo_template.user.dtos.UserCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.user.refresh_token.RefreshToken;
import ar.uba.fi.ingsoft1.todo_template.user.refresh_token.RefreshTokenService;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.EmailService;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.VerificationToken;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.VerificationTokenRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    UserService(
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            VerificationTokenRepository verificationTokenRepository,
            RefreshTokenService refreshTokenService,
            EmailService emailService
    ) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.refreshTokenService = refreshTokenService;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> {
                    var msg = String.format("Username '%s' not found", username);
                    return new UsernameNotFoundException(msg);
                });
    }

    void createUser(UserCreateDTO data) throws UserAlreadyExistsException, EmailAlreadyExistsException {
        if (userRepository.findByUsername(data.username()).isPresent()) {
            throw new UserAlreadyExistsException(data.username());
        } else if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new EmailAlreadyExistsException(data.email());
        } else {
            var user = data.asUser(passwordEncoder::encode);
            userRepository.save(user);

            String token = UUID.randomUUID().toString();
            var verificationToken = new VerificationToken();
            verificationToken.setValue(token);
            verificationToken.setUser(user);
            verificationToken.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));

            verificationTokenRepository.save(verificationToken);

            String verificationLink = "http://localhost:5173/verify?token=" + token;

            emailService.sendVerificationEmail(
                    user.getEmail(),
                    "Verifica tu cuenta",
                    verificationLink
            );
        }
    }

    Optional<TokenDTO> loginUser(UserCredentials data) throws UserNotVerifiedException {
        Optional<User> maybeUser = userRepository.findByEmail(data.email());

        if (!maybeUser.isEmpty() && !maybeUser.get().getState()) {
            throw new UserNotVerifiedException();
        }

        return maybeUser
                .filter(user -> passwordEncoder.matches(data.password(), user.getPassword()))
                .map(this::generateTokens);
    }

    Optional<TokenDTO> refresh(RefreshDTO data) {
        return refreshTokenService.findByValue(data.refreshToken())
                .map(RefreshToken::user)
                .map(this::generateTokens);
    }

    private TokenDTO generateTokens(User user) {
        String accessToken = jwtService.createToken(new JwtUserDetails(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        ));
        RefreshToken refreshToken = refreshTokenService.createFor(user);
        return new TokenDTO(accessToken, refreshToken.value(), user.getRole());
    }


    public String obtenerEmailPorId(String username){
        return userRepository.findById(username)
                .orElseThrow(()->new RuntimeException("Usuario no encontrado"))
                .getEmail();
    }

    public User obtenerUsuarioPorId(String username){
        return userRepository.findById(username)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado con id: "+ username));
                
    }
}
