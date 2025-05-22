# Bonnes pratiques pour les migrations de base de données

## Conventions de nommage Flyway

- Les fichiers de migration **doivent** suivre le format : `V{version}__{description}.sql`
  - Exemple correct : `V1__Create_User_Table.sql`, `V2__Add_Reset_Password_Fields.sql`
  - Notez le **double underscore** entre le numéro de version et la description
  - Les versions doivent être séquentielles et ne jamais être modifiées une fois déployées

## Compatibilité entre environnements

### PostgreSQL vs H2

Pour assurer la compatibilité entre PostgreSQL (production) et H2 (tests), respectez ces règles :

1. Utilisez uniquement la syntaxe SQL standard compatible avec les deux dialectes
2. Évitez les fonctionnalités spécifiques à PostgreSQL dans les migrations :
   - Types de données spécifiques (jsonb, arrays, etc.)
   - Fonctions et opérateurs spécifiques
   - Extensions PostgreSQL

3. Pour les tests, utilisez PostgreSQL plutôt que H2 quand c'est possible :
   - Utilisez un conteneur Docker pour les tests locaux
   - Configurez les tests CI pour utiliser PostgreSQL

## Tests avant commit

1. Exécutez toujours le script `run-tests-postgresql.bat` avant de pousser des migrations
2. Vérifiez que les migrations s'exécutent correctement sur une base PostgreSQL locale
3. Validez que tous les tests passent avec PostgreSQL

## Résolution des problèmes courants

### Erreur "Column not found"

Causes possibles :
- Fichier de migration mal nommé (vérifiez le double underscore)
- Migration non exécutée due à une erreur silencieuse
- Différence de dialecte SQL entre H2 et PostgreSQL

Solution :
- Vérifiez les journaux Flyway pour identifier les migrations qui ont échoué
- Testez avec PostgreSQL localement avant de pousser
- Utilisez `spring.jpa.show-sql=true` pour déboguer les requêtes SQL générées

### Erreur de syntaxe SQL

Cause probable : incompatibilité de dialecte
Solution : reformulez la migration pour utiliser une syntaxe SQL standard
