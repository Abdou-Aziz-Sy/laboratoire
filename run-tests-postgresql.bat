@echo off
echo ===== Exécution des tests avec PostgreSQL =====

echo Configuration des variables d'environnement pour les tests...
set SPRING_PROFILES_ACTIVE=test
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskhandler_test
set SPRING_DATASOURCE_USERNAME=postgres
set SPRING_DATASOURCE_PASSWORD=postgres

echo Exécution des tests avec Maven...
mvn test

echo ===== Fin des tests =====
