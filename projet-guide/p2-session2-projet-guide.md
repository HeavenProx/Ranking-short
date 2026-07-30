# Phase 2 · Session 2 — Générer une frame d'overlay

Guide d'aiguillage : QUOI construire, POURQUOI, et dans QUEL ordre.
Le code reste ton exercice — aucune solution écrite ici.

Emplacement : `ranking-shorts/`
Vérification : `npm run check` + ouvrir le PNG produit

---

## En une phrase

Tu crées la couche `renderer/` : elle prend ta **Spec validée** (session 1)
et en dessine **une image d'overlay** — titre + liste numérotée, sur fond
transparent. Pas d'animation, pas de vidéo : juste une frame fixe, complète.

---

## Ce qu'on ajoute, et où ça se place

Jusqu'ici tu savais charger et valider une Spec. Elle ne produisait rien
de visible. On ajoute la première brique qui TRANSFORME la Spec en pixels.

```
   cli  ──charge──►  Spec validée  ──►  renderer  ──►  overlay.png
   (session 1)         (core)          (SESSION 2)     (fond transparent)
```

Rappel d'archi : le `renderer` **dépend du core** (il lit une Spec) et
**connaît canvas** — mais il ne connaît NI ffmpeg, NI le disque au-delà
de sauver son image. Il ne fait qu'une chose : Spec → image.

---

## Arborescence cible

```
src/
  core/               ← inchangé (types + validation)
  cli/
    charger-spec.ts   ← inchangé (session 1)
    index.ts          ← on l'étend : charge PUIS dessine
  renderer/
    dessiner-overlay.ts   ← NOUVEAU : Spec → une image d'overlay
```

---

## Ordre de construction

### 1. `renderer/dessiner-overlay.ts` — la fonction de rendu

Une fonction qui reçoit ta `Spec` et rend (ou sauve) une image.

⚠️ **Elle prend la Spec en paramètre, elle ne la charge pas.** Charger,
c'est le travail de la cli (session 1). Dessiner, c'est le sien. Chacune
son job — c'est la frontière d'archi.

💡 La taille du canvas vient de `spec.dimensions` (ou équivalent selon ta
modélisation). Tu réutilises la Spec validée : c'est la récompense de
tout le travail de typage de la Phase 1.

### 2. Le fond : ne rien peindre

⚠️ Ne remplis PAS l'arrière-plan. La transparence, c'est l'absence de
fond (exercice section 3). Si tu peins un fond, ffmpeg ne pourra pas
superposer l'overlay aux clips en Phase 2 session 5.

### 3. Le titre

Dessine `spec.titre` en haut, centré. Choisis une taille lisible pour du
1080 de large (gros : pense format vertical vu sur téléphone).

💡 `textAlign = "center"` + un x au milieu de la largeur = titre centré
sans calcul de largeur.

### 4. La liste numérotée

Parcours les items de la Spec et dessine chacun sous la forme
« rang. texte », espacés verticalement.

💡 La position verticale de chaque ligne se calcule à partir de son
index (comme l'exercice section 5) : un Y de départ + index × interligne.

💡 Le rang est déjà dans ton item (tu l'as modélisé en Phase 1) — pas
besoin de le recalculer, sers-toi de la donnée.

### 5. Sauvegarder

Sauve l'image dans `out/` (crée le dossier si besoin, comme session 1).
Un seul fichier, ex. `out/overlay.png`.

### 6. Brancher dans la cli

Étends `cli/index.ts` : après avoir chargé + validé la Spec (session 1),
passe-la à `dessinerOverlay`. C'est la PREMIÈRE fois que deux couches
s'enchaînent de bout en bout :

```
   index.ts :  chargerSpec(chemin)  →  Spec  →  dessinerOverlay(Spec)  →  PNG
```

---

## Vérifier

```bash
npm start -- examples/demo.json
```

Puis **ouvre `out/overlay.png`** dans une visionneuse d'images :

- le titre est en haut, lisible
- la liste 1→N est dessinée, espacée régulièrement
- le fond est transparent (damier dans la visionneuse), PAS blanc ou noir

Le test du fond transparent est le plus important : c'est lui qui
conditionne toute la composition vidéo à venir.

---

## Le piège à éviter

- **Ne code pas l'animation.** L'apparition progressive des items, c'est
  la session 4. Aujourd'hui, TOUS les items sont visibles sur une frame
  fixe. Si tu commences à gérer le temps, tu débordes.
- **Ne mets pas ffmpeg ni de logique vidéo dans `renderer/`.** Il ne
  connaît que canvas. Le reste viendra dans `encoder/`.
- **Ne code pas en dur 1080×1920.** Lis les dimensions depuis la Spec.

---

## Validé quand

- [ ] `renderer/dessiner-overlay.ts` prend une Spec et rend une image
- [ ] le fond est transparent (vérifié à l'œil dans une visionneuse)
- [ ] titre + liste numérotée corrects, dimensions issues de la Spec
- [ ] `cli/index.ts` enchaîne charger → dessiner
- [ ] `npm run check` propre
- [ ] commit : `feat: rendu d'une frame d'overlay depuis la spec`

---

## Comment je t'aide

- tu me colles `dessinerOverlay` → je te dis si la frontière renderer/core
  est propre et si le rendu est bien piloté par la Spec
- une erreur skia-canvas / tsc incomprise → on la décode
- un doute sur le placement (titre, interligne) → on en parle

Je n'écris pas la fonction à ta place. Montre d'abord ta tentative.
