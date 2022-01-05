# TapTapTrees

📌 Lien vers le jeu : https://fir-app-e94c4.web.app/
(accessible et compatible PC et mobile)

## Informations sur le contexte et le jeu
Application des cours angular dans une première application intégrée à l'API Firebase.

Il s'agit d'un jeu plutot simple du type 'chasse taupe'. 
Les règles du jeu sont à découvrir à l'intérieur

La plateforme dispose :
- un 'shop' avec des améliorations et des booster à acheter (avec la monnaie du jeu) pour améliorer ses performances de jeu,
- un profil utilisateur avec ses données personnelles
- un page principale permettant de commencer à jouer et régler la difficulté
- un leaderboard affichant les 20 meilleurs joueurs de chaque difficultés
- des options permettant de configurer la langue de la plateforme, options graphiques, message aux développeurs, etc ...


## Deploiement en ligne avec l'API Firebase

- Login into Firebase : firebase login
- Build de l'appli : ng build
Permet de compiler les fichiers dans un dossier distant (dist)
- Test du rendu en local avant déploiement: firebase serve --only hosting
- Déploiement : firebase deploy -m "#commentaire"
- Attendre ! Il faut environ 30 minutes avant de pouvoir remarquer la nouvelle version


## Quelques liens

Firebase link url
https://console.firebase.google.com/project/fir-app-e94c4/settings/general/web:MDhjYzAxNTktOTRmMS00NWFhLThkNjYtMWEzODQ0NWVkZGU3

Firebase relevant ressources:
https://github.com/angular/angularfire/blob/master/docs/rtdb/lists.md

Flame dynamic : https://codepen.io/jkantner/pen/gKRKKb
