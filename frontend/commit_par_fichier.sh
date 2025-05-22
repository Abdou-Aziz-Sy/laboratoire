#!/bin/bash

# Se déplacer dans le répertoire du projet
cd "/c/Users/DELL/Desktop/WEB/taskhandler/frontend" || exit 1

# Récupérer la liste des fichiers modifiés (tracked)
modified_files=$(git diff --name-only)

# Récupérer la liste des fichiers non suivis (untracked)
untracked_files=$(git ls-files --others --exclude-standard)

# Commits pour les fichiers modifiés
for file in $modified_files; do
  git add "$file"
  git commit -m "feat(UI) :Ajout du dashboard"
done

# Commits pour les fichiers non suivis
for file in $untracked_files; do
  git add "$file"
  git commit -m "feat(UI) :Ajout du dashboard"
done
