# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site vitrine statique, en français, pour le client **RF Rénovation** (travaux d'espaces verts et de toiture, basé à Pau, zone d'intervention 64-65-40). Objectif : être visible en ligne et attirer de nouveaux clients, avec les deux activités sur le site. Plan de site : Accueil > Espaces verts > Toitures > Contact, plus Mentions légales (pas de page « Services » intermédiaire : le menu pointe directement vers les deux activités).

HTML, CSS et JavaScript vanilla uniquement. Pas de bundler, de linter ni de tests automatisés.

## Commandes

- Prévisualiser : `python3 -m http.server` à la racine, puis ouvrir `localhost:8000`. Ouvrir les fichiers en `file://` fonctionne aussi (liens tous relatifs).
- Vérification visuelle : Playwright est préinstallé (`require('playwright')`, `chromium.launch()` sans option). Charger les pages en `file://`, tester à 1280 px et 390 px de large, et contrôler `document.documentElement.scrollWidth - clientWidth === 0` (aucun défilement horizontal).
- Déploiement : un push sur `main` lance `.github/workflows/pages.yml` (GitHub Pages). Le premier run échoue tant que la source de Pages n'est pas réglée sur « GitHub Actions » dans les réglages du dépôt. Développer sur la branche de session et ne pousser sur `main` qu'avec l'accord de l'utilisateur.

## Architecture

Cinq pages : `index.html`, `contact.html`, `mentions-legales.html`, `services/espaces-verts.html`, `services/toitures.html`. Un seul `css/style.css` et un seul `js/main.js`.

Points à connaître avant de modifier :

- **Pas de templating.** L'en-tête, le pied de page, la barre mobile « Appeler / Demander un devis » et le sprite SVG d'icônes (`#i-leaf`, `#i-roof`, `#i-team`, `#i-phone`, placé en début de `<main>`) sont dupliqués dans chaque page. Toute modification de l'un d'eux doit être reportée sur les cinq fichiers.
- **Chemins relatifs uniquement.** Les pages de `services/` préfixent leurs liens par `../`. Ne jamais utiliser de chemin absolu (`/css/...`) : le site est servi sous `/Toiture-X-Espace-verts-/` sur GitHub Pages.
- **Liens vers le devis.** Sur l'accueil le bouton pointe vers `#contact` (formulaire de la page). Sur les pages d'activité (`services/`), il pointe vers `../contact.html#espaces-verts` ou `#toiture`. `js/main.js` lit ce hash pour présélectionner `#f-type` : les `value` des `<option>` (`espaces-verts`, `toiture`, `les-deux`) doivent rester alignées avec ces ancres.
- **Emplacements photo.** Chaque image est un `<figure class="photo photo-garden|photo-roof">` avec un visuel provisoire (icône + légende « Photo à venir »). Pour une vraie photo, ajouter un `<img>` dans la figure : `.photo img` le fait recouvrir l'emplacement (`object-fit:cover`). Les figures de la galerie portent `data-cat="garden|roof"`, utilisé par le filtre.
- **JavaScript (`js/main.js`).** Menu mobile, apparition au défilement des éléments `.reveal` (la classe `js` est posée sur `<html>`, donc sans JS rien n'est masqué), filtre de la galerie (`.chip[data-filter]`), validation du formulaire. Le formulaire n'envoie rien : il affiche un message de maquette. L'envoi réel reste à brancher.
- **CSS.** Tous les tokens (couleurs, polices, hauteur d'en-tête) sont dans `:root`. Polices Cormorant Garamond et Inter chargées depuis Google Fonts. Points de rupture principaux : 820 px (menu burger, grilles en une colonne) et 460 px.

## Contenu provisoire à remplacer

- Téléphone `05 00 00 00 00` / `tel:+33500000000`, présent dans toutes les pages.
- `https://example.com` dans `sitemap.xml` et `robots.txt` (nom de domaine à définir).
- Mentions légales : champs « À compléter » (forme juridique, SIRET, adresse, e-mail, assurance, hébergeur).
- Toutes les photos, et les textes de prestations, étapes et communes desservies, rédigés par défaut et à faire valider par le client.

## Conventions

Contenu, commentaires et messages de commit en français. Ne pas inventer d'informations sur l'entreprise (avis, ancienneté, certifications).

Si la page d'accueil est publiée comme Artifact, `index.html` doit être publié sous forme de fragment (sans `<!DOCTYPE>`, `<html>`, `<head>` ni `<body>`, avec `<title>` et les `<link>` en tête) ; les autres pages sont publiées telles quelles, avec les fichiers CSS et JS.
