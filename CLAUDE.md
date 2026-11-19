# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site vitrine statique, en français, pour le client **RF Rénovation**, couvreur basé à Pau (zone d'intervention 64-65-40). Le site ne présente plus que l'activité toiture. Plan de site : Accueil > Services > À propos > Contact, plus Mentions légales.

HTML, CSS et JavaScript vanilla, animations GSAP 3.12.5 + ScrollTrigger chargées depuis cdnjs. Pas de bundler, de linter ni de tests automatisés.

## Commandes

- Prévisualiser : `python3 -m http.server` à la racine, puis ouvrir `localhost:8000`. Ouvrir les fichiers en `file://` fonctionne aussi (liens tous relatifs).
- Vérification visuelle : Playwright est préinstallé (`require('playwright')`, `chromium.launch()` sans option). Charger les pages en `file://`, tester à 1280 px et 390 px de large, et contrôler `document.documentElement.scrollWidth - clientWidth === 0` (aucun défilement horizontal).
- Déploiement : un push sur `main` lance `.github/workflows/static.yml` (GitHub Pages). Développer sur la branche de session et ne pousser sur `main` qu'avec l'accord de l'utilisateur.

## Architecture

Cinq pages : `index.html`, `services.html`, `a-propos.html`, `contact.html`, `mentions-legales.html`. Une seule feuille `css/site.css` et un seul script `js/site.js`. Direction artistique : « galerie blanche » façon Apple (fond blanc, bandes `#f5f5f7`, bleu réservé aux pilules et aux liens, rayons de 28 px, aucune ombre, police Inter).

Points à connaître avant de modifier :

- **Pas de templating.** L'en-tête (`.gnav`, collant en haut de l'écran, avec le bouton « Devis gratuit » et le burger mobile), le menu plein écran `#menu` (placé hors de l'en-tête : un ancêtre transformé casserait son `position:fixed`), le pied de page, les balises `<script>` et le bloc de motifs SVG (`<svg class="defs">` en début de `<main>` : `#p-slate`, `#p-tile`, `#p-zinc`, `#p-moss`…) sont dupliqués dans chaque page. Toute modification doit être reportée sur les cinq fichiers. Seule la barre de page (`.lnav`, titre et ancres, non collante, masquée sous 820 px) change d'une page à l'autre.
- **Chemins relatifs uniquement.** Ne jamais utiliser de chemin absolu (`/css/...`) : le site est servi sous `/Toiture-X-Espace-verts-/` sur GitHub Pages.
- **Ancres des services et formulaire.** Les blocs de `services.html` ont pour `id` : `couverture`, `reparation`, `entretien`, `zinguerie`, `fenetres-de-toit`, `isolation`. Leurs boutons pointent vers `contact.html#<id>`, et `js/site.js` lit ce hash pour présélectionner `#f-type` : les `value` des `<option>` doivent rester identiques à ces `id`. L'accueil a aussi un formulaire (`#contact`).
- **Visuels.** Pas de photos pour l'instant : toutes les illustrations sont des SVG dessinés (toit de l'accueil, rue de maisons sur Services, Pyrénées sur À propos, textures ardoise/tuile/zinc). Les ardoises du toit de l'accueil sont générées par `js/site.js` (`#slates`) par-dessus un motif de secours.
- **JavaScript (`js/site.js`).** Chaque bloc ne s'exécute que si la page contient les éléments concernés. Sans JS, sans GSAP ou avec `prefers-reduced-motion`, tout le contenu reste visible : GSAP ne pose que des états de départ. Attributs utiles : `data-reveal` (apparition), `data-reveal-group` (enfants en cascade), `data-words` (texte qui s'allume mot à mot), `data-depth` et `data-rise` (parallaxe et entrée des visuels d'en-tête), `data-fix` (ardoise remise en place). Au-dessus de 820 px, le carrousel des prestations et l'anatomie de l'accueil sont épinglés (ScrollTrigger `pin`). Le formulaire n'envoie rien : l'envoi réel reste à brancher.
- **CSS.** Tous les tokens sont dans `:root` de `css/site.css`. Points de rupture : 1000 px (ancres de la barre de page masquées), 820 px (burger, barre de page masquée, une colonne, zones tactiles agrandies), 600 px (toit de l'accueil élargi, départements empilés), 460 px (titres réduits, tuiles en une colonne) et 374 px (bouton « Devis » raccourci). Les épinglages ScrollTrigger ne s'activent qu'au-dessus de 820 px de large et 700 px de haut. Sur écran tactile (`hover: none`), les effets de survol des cartes sont déclenchés par la classe `.is-live` quand la carte est visible. Ne jamais laisser de `transform` sur `.gnav` (l'animation d'entrée cible `.gnav-in` avec `clearProps`).
- **Anciennes pages.** `services/toitures.html` redirige vers `services.html`. `services/espaces-verts.html` n'est plus liée et utilise encore l'ancien `css/style.css` et `js/main.js`.

## Contenu provisoire à remplacer

- Téléphone `05 00 00 00 00` / `tel:+33500000000`, e-mail `contact@rf-renovation.fr` et horaires, présents dans toutes les pages.
- `https://example.com` dans `sitemap.xml` et `robots.txt` (nom de domaine à définir).
- Mentions légales : champs « À compléter » (forme juridique, SIRET, adresse, directeur de la publication, assurance).
- Textes des prestations, engagements, étapes, questions fréquentes et communes desservies, rédigés par défaut et à faire valider par le client. Photos réelles à ajouter.

## Conventions

Contenu, commentaires et messages de commit en français. Ne pas inventer d'informations sur l'entreprise (avis, ancienneté, certifications).

