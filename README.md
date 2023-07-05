# A propos du Blog

Le Blog (ou Site) du JDL (Journal du Lycée la Rochefoucauld) met à disposition du contenu dans le cadre du Lycée la Rochefoucauld.
Nous proposons sur ce Blog des directs webradio et leurs podcasts de rediffusion, des vidéos et des articles.


- Les directs webradio sont rendus possibles à notre serveur de direct fonctionnant avec Nginx.
Leurs rediffusions au format podcast se font à l'aide d'intégrations de la plateforme Ausha.
- Les vidéos proposées sont intégrées au Blog à l'aide d'intégrations YouTube et/ou Instagram.
- Les articles sont directement proposés sur le blog, sans intégration.

Ces intégrations sont susceptibles de déposer des cookies marketing que vous pouvez refuser sur leurs sites respectifs :

- [YouTube](https://consent.youtube.com/d?continue=https://www.youtube.com/%3Fcbrd%3D1&gl=FR&m=0&pc=yt&hl=fr&src=2)
- [Ausha](https://www.ausha.co/fr/) (cliquer sur le bouton dans le coin inférieur gauche)
- [Instagram](https://www.instagram.com/accounts/cookie_settings/) (nécessite une connexion à votre compte)

## Hébergement du Blog

Ce blog est hébergé chez [Hostim](https://hostim.fr).
Le nom de domaine [le-jdl-laroche.cf](/) est enregistré chez [Freenom](https://freenom.com).

## Développement du Blog

Le Blog du JDL utilise la technologie [SvelteKit](https://kit.svelte.dev) de Svelte pour son développement, ainsi que différentes librairies Node.js qui lui sont associées. L'utilisation de cette technologie ne concerne que le front-end du Blog (partie visible par les utilisateurs).

Le Blog est hébergé sur un server Node.js, qui sert les fichiers statiques générés par SvelteKit, en combinaison avec un server NGINX pour l'acheminement des requêtes.