# Phase 2 · Session 3 — Premier appel ffmpeg depuis Node

Guide d'aiguillage : QUOI construire, POURQUOI, dans QUEL ordre.
Le code reste ton exercice.

Emplacement : `ranking-shorts/`
Prérequis : `ffmpeg -version` répond

---

## En une phrase

Tu crées la couche `encoder/` avec un helper qui lance ffmpeg proprement
(le patron `executer` de l'exercice), et tu t'en sers pour un PREMIER
appel ffmpeg réel. Objectif : valider la tuyauterie Node → ffmpeg, pas
faire la vidéo finale.

---

## Ce qu'on ajoute, et où ça se place

Ton `renderer/` produit une image (session 2). Il faut maintenant une
couche qui sait parler à ffmpeg. C'est `encoder/`.

```
   renderer  ──►  overlay.png          (session 2)
   encoder   ──►  pilote ffmpeg        (SESSION 3)  ← nouveau
```

Rappel d'archi : `encoder/` **connaît ffmpeg et le disque**, mais ne
connaît PAS canvas. Il dépend du core (pour les infos de la Spec :
dimensions, fps) mais ne dessine rien lui-même.

⚠️ Frontière importante : `renderer` DESSINE, `encoder` ENCODE. Si tu te
retrouves à appeler du canvas dans encoder/ ou ffmpeg dans renderer/,
la frontière a fuité.

---

## Arborescence cible

```
src/
  core/                 ← inchangé
  renderer/             ← inchangé (session 2)
  encoder/
    executer.ts         ← NOUVEAU : le helper spawn->Promise (le patron du 3)
    ffmpeg.ts           ← NOUVEAU : construit et lance une commande ffmpeg
```

---

## Ordre de construction

### 1. `encoder/executer.ts` — le helper de lancement

Reprends le patron `executer(cmd, args)` de la section 3 de l'exercice :
- lance le programme avec spawn
- accumule stderr (pour un message d'erreur utile)
- resolve si code 0, reject sinon (avec le stderr dans le message)
- gère aussi l'erreur "programme introuvable" (proc.on("error"))

💡 C'est une fonction générique : elle ne connaît pas ffmpeg en
particulier. Elle sait juste "lancer un programme et attendre sa fin".
Tu pourrais la réutiliser pour n'importe quel binaire.

### 2. `encoder/ffmpeg.ts` — construire une commande

Une fonction qui construit le TABLEAU d'arguments ffmpeg et appelle
`executer("ffmpeg", args)`.

⚠️ Chaque option et sa valeur = deux éléments séparés du tableau
(`"-i", chemin`), jamais `"-i chemin"` en un seul (raison : exercice 4b).

### 3. Le premier test réel : image fixe → vidéo courte

Pour valider la chaîne SANS attendre toute la logique vidéo, fais le
plus simple qui prouve que ça marche : transformer ton `overlay.png`
(généré session 2) en une petite vidéo de quelques secondes.

Les options ffmpeg dont tu as besoin (à assembler toi-même, cherche leur
rôle dans `ffmpeg -h` ou la doc) :
- boucler une image fixe en entrée (option `-loop`)
- fixer une durée (option `-t`)
- forcer l'écrasement de la sortie (`-y`)
- un fichier de sortie `.mp4` dans `out/`

💡 Tu n'as pas besoin de comprendre l'encodage vidéo en détail. Tu as
besoin que Node lance ffmpeg, que ffmpeg produise un fichier, et que le
code de sortie soit 0. C'est ça, "la tuyauterie marche".

### 4. Vérifier

```bash
npm start -- examples/demo.json    # ou un script de test dédié
```

- un fichier `out/*.mp4` apparaît
- il se lit dans un lecteur vidéo (VLC, navigateur…)
- en cas d'erreur ffmpeg, ton `executer` remonte un message lisible
  (pas un plantage brut)

---

## Le piège à éviter (et le garde-fou du projet)

⚠️ **Ne te lance pas dans la composition overlay + clips vidéo
aujourd'hui.** C'est tentant, mais c'est la session 5 — et c'est
précisément la zone couverte par ton timebox de 2 semaines. Aujourd'hui,
une image fixe → une vidéo. Rien de plus. On valide la plomberie, on ne
construit pas encore la maison.

⚠️ Ne mélange pas les couches : pas de canvas dans encoder/.

---

## Validé quand

- [ ] `encoder/executer.ts` : spawn enveloppé en Promise, erreurs gérées
- [ ] `encoder/ffmpeg.ts` : construit les args et lance ffmpeg
- [ ] un `out/*.mp4` est produit à partir d'une image fixe et se lit
- [ ] une erreur ffmpeg remonte un message clair
- [ ] `npm run check` propre
- [ ] commit : `feat: pilotage ffmpeg depuis node (encoder)`

---

## Comment je t'aide

- tu me colles `executer` ou ta commande ffmpeg → je te dis si la
  structure est bonne et si les args sont bien formés
- une erreur ffmpeg incompréhensible → on la décode ensemble (c'est
  fréquent, ffmpeg est bavard)
- un doute sur "quelle option ffmpeg pour X" → on en parle

Je n'écris pas la commande à ta place. Montre ce que tu as tenté.
