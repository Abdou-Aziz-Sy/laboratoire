package com.example.taskmanager;



import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTests {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldFindUserByEmail() {
        // given
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFirstName("Test");
        user.setLastName("User");
        entityManager.persist(user);
        entityManager.flush();

        // when
        Optional<User> found = userRepository.findByEmail(user.getEmail());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public void shouldCheckIfEmailExists() {
        // given
        User user = new User();
        user.setEmail("exists@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        boolean exists = userRepository.existsByEmail("exists@example.com");
        boolean notExists = userRepository.existsByEmail("notexists@example.com");

        // then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    public void shouldFindUserByActivationToken() {
        // given
        User user = new User();
        user.setEmail("token@example.com");
        user.setPassword("password");
        user.setActivationToken("test-token-123");
        entityManager.persist(user);
        entityManager.flush();

        // when
        Optional<User> found = userRepository.findByActivationToken("test-token-123");

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getActivationToken()).isEqualTo("test-token-123");
    }
}