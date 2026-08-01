# Phase 2 · Session 4 — Générer la séquence de frames animée

Guide d'aiguillage : QUOI construire, POURQUOI, dans QUEL ordre.
Le code reste ton exercice.

Emplacement : `ranking-shorts/`
Vérification : `npm run check` + inspecter `out/frames/`

---

## En une phrase

Tu fais apparaître ta liste item par item. Concrètement : tu déplaces le
TIMING dans `core/` (logique pure), tu rends ton renderer capable de
dessiner une frame pour un état donné, et tu génères la SÉQUENCE complète
de PNG. Toujours pas de vidéo finale — on prépare les frames pour ffmpeg.

---

## Ce qu'on change, et pourquoi

Session 2 : ton renderer dessinait UNE frame avec TOUS les items.
Aujourd'hui : il doit dessiner N'IMPORTE QUELLE frame, avec seulement les
items visibles à cet instant. Et le calcul de "cet instant" ne va PAS
dans le renderer.

```
   AVANT (session 2)                 APRÈS (session 4)

   renderer(spec)                    core : itemsVisibles(frame) → état (PUR)
     └─ dessine tous les items       renderer(spec, état) → dessine cet état
                                      boucle : pour chaque frame → 1 PNG
```

⚠️ **Le timing va dans core/, pas dans renderer/.** "À la frame N,
combien d'items visibles ?" est une logique pure, déterministe, testable
sans image. Elle appartient au cœur (note d'archi §7). Le renderer ne
fait que PEINDRE l'état qu'on lui donne.

💡 Le bénéfice concret : tu pourras vérifier tout ton timing d'animation
avec des `console.log`, sans générer une seule image. Rapide à debugger.

---

## Arborescence cible

```
src/
  core/
    spec.ts
    valider-spec.ts
    timeline.ts        ← NOUVEAU : itemsVisibles(frame, ...) — pur
  renderer/
    draw-overlay.ts    ← MODIFIÉ : dessine un ÉTAT (items visibles) donné
    sequence.ts        ← NOUVEAU : boucle sur les frames → écrit les PNG
  encoder/             ← inchangé (session 3)
out/
  frames/              ← NOUVEAU : frame-0001.png, frame-0002.png, …
```

---

## Ordre de construction

### 1. `core/timeline.ts` — le timing, pur

Porte ici la logique de l'exercice (itemsVisibles, temps d'une frame).
Décide de ta règle d'apparition (ex. un item toutes les 0,5 s) à partir
du fps de la Spec.

⚠️ Aucun import de canvas, fs, ffmpeg ici. Que des maths sur des nombres.
💡 Teste-la avec quelques `console.log` avant d'aller plus loin. Si le
timing est faux ici, toutes tes frames seront fausses.

### 2. `renderer/draw-overlay.ts` — dessiner un état

Adapte ta fonction de la session 2 : au lieu de dessiner tous les items, elle dessine seulement ceux visibles à une frame donnée. Deux options de signature, à toi de choisir :
- elle reçoit le numéro de frame et interroge la timeline, OU
- elle reçoit directement le nombre d'items à afficher (plus pur)

💡 La 2e est plus propre : le renderer ne calcule rien, il reçoit l'état.
Le calcul reste dans core. Préfère celle-là.

### 3. `renderer/sequence.ts` — la boucle

Une fonction qui, pour une Spec :
- calcule le nombre total de frames (fps × durée)
- pour chaque frame : détermine l'état (via core/timeline), dessine,
  écrit le PNG dans `out/frames/` avec un nom zéro-rempli
- crée `out/frames/` au besoin (comme session 1)

⚠️ Noms zéro-remplis obligatoires (`frame-0001.png`) — sinon ffmpeg
assemblera dans le désordre (exercice 4b).

### 4. Vérifier

```bash
npm start -- examples/demo.json    # ou script dédié
```

- `out/frames/` contient le bon nombre de PNG (fps × durée)
- ouvre-en quelques-uns dans l'ordre : la liste se REMPLIT
  progressivement (frame 1 = titre seul ou 1 item, dernières = tout)
- le fond reste transparent sur toutes

💡 Astuce debug : regarde d'abord la sortie console de la timeline
(combien d'items par frame) AVANT de générer les images. Logique juste
= images justes.

---

## Le piège à éviter

⚠️ **Ne recolle pas encore les frames en vidéo, et surtout pas avec les
clips.** Assembler la séquence en MP4 + composer avec les clips, c'est la
session 5 (zone du timebox). Aujourd'hui : produire les PNG, les
regarder. C'est tout.

⚠️ Ne laisse pas le calcul de timing s'infiltrer dans le renderer ou la
boucle. Il vit dans core/timeline.ts, point.

---

## Validé quand

- [ ] `core/timeline.ts` calcule l'état d'une frame, sans rien dessiner
- [ ] le renderer dessine un ÉTAT reçu, il ne calcule pas le timing
- [ ] `out/frames/` contient la séquence complète, noms zéro-remplis
- [ ] en parcourant les PNG dans l'ordre, la liste apparaît par étapes
- [ ] `npm run check` propre
- [ ] commit : `feat: génération de la séquence de frames animée`

---

## Comment je t'aide

- tu me colles `timeline.ts` → je te dis si le timing est juste et
  bien isolé du rendu
- tu me colles ta boucle `sequence.ts` → je vérifie la frontière et le
  nommage des frames
- un PNG qui sort faux → on remonte à la logique ensemble

Je n'écris pas les fonctions à ta place. Montre d'abord ta tentative.
