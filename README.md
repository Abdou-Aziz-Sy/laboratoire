**TaskManager** est une application de gestion de tâches composée d'un backend Spring Boot et d'un frontend React. Ce projet est en phase de développement et intègre des workflows CI/CD via GitHub Actions pour automatiser les builds et tests sur un environnement de staging.
## Prérequis

Assurez-vous d'avoir installé sur votre machine :
- **Git** (pour cloner le dépôt)
- **Java OpenJDK 17** (pour le backend)
- **Maven** (pour compiler et exécuter le backend)
- **Node.js** et **npm** (pour le frontend React)
- Un éditeur de code (ex. VS Code, IntelliJ IDEA, etc.)

## Installation

### Clonage du dépôt

Clonez le dépôt GitHub sur votre machine :

```bash
git clone https://github.com/noreyni03/taskmanager.git
cd taskmanager
```

### Configuration du Backend (Spring Boot)

1. **Naviguez dans le répertoire racine du projet.**
2. Le projet Spring Boot se trouve dans le dossier racine, avec la structure suivante :
   ```
   taskmanager/
   ├── src
   │   ├── main
   │   │   ├── java
   │   │   └── resources
   │   └── test
   │       └── java
   └── pom.xml
   ```
3. Si nécessaire, créez le dossier `src/main/resources` et ajoutez-y un fichier `application.properties` (ex. pour définir le port ou d'autres configurations) :

```bash
mkdir -p src/main/resources
echo "server.port=8080" > src/main/resources/application.properties
```

### Configuration du Frontend (React)

1. **Le dossier `client` contient l'application React.**  
   La structure du dossier `client` est la suivante :
   ```
   client/
   ├── public
   │   ├── index.html
   │   └── ...
   ├── src
   │   ├── App.js
   │   └── ...
   ├── package.json
   └── README.md
   ```
2. **Installer les dépendances**  
   Placez-vous dans le dossier `client` et installez les dépendances :

```bash
cd client
npm ci
```

3. **Configurer le proxy**  
   Dans le fichier `client/package.json`, assurez-vous d'avoir une entrée `"proxy": "http://localhost:8080"`. Cela permettra à votre application React d'interroger l'API Spring Boot durant le développement.

## Exécution de l'application

### Démarrage du backend

Depuis la racine du projet, compilez et exécutez l'application Spring Boot :

```bash
mvn clean package
mvn spring-boot:run
```

Votre backend s'exécutera par défaut sur [http://localhost:8080](http://localhost:8080).

### Démarrage du frontend en mode développement

Dans un terminal séparé, placez-vous dans le dossier `client` et démarrez l'application React :

```bash
cd client
npm start
```

L'application React sera accessible sur [http://localhost:3000](http://localhost:3000) et utilisera le proxy pour communiquer avec le backend.

## Tests

- **Backend :**  
  Exécutez les tests unitaires et d'intégration avec Maven :

  ```bash
  mvn test
  ```

- **Frontend :**  
  Dans le dossier `client`, lancez les tests :

  ```bash
  cd client
  npm test -- --watchAll=false
  ```

## Workflow CI/CD

Le projet inclut un workflow GitHub Actions pour automatiser les builds et tests en environnement de staging. Le fichier de configuration se trouve à l'emplacement `.github/workflows/ci.yml`.

Chaque push sur les branches `main` ou `staging` déclenche les étapes suivantes :
- **Backend :**  
  Installation de JDK 17, compilation avec Maven et exécution des tests.
- **Frontend :**  
  Installation de Node.js, installation des dépendances, build de l'application React et exécution des tests.

Vous pouvez consulter l'onglet **Actions** de notre dépôt GitHub pour suivre l'exécution des workflows.

## Contribuer

Nous encourageons les contributions ! Pour contribuer, suivez ces étapes :

1. **Fork** le dépôt et clonez votre fork.
2. Créez une branche pour votre fonctionnalité ou correction :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalité
   ```
3. Effectuez vos modifications et **commit**z-les avec des messages clairs.
4. **Poussez** votre branche sur votre fork :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalité
   ```
5. Ouvrez une **Pull Request** sur le dépôt principal.
