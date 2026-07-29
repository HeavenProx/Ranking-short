# Session 6 — Application projet : modéliser la source d'un item

Guide d'aiguillage. Il te dit QUOI construire et dans QUEL ordre.
Le contenu des types reste ton exercice : ici, pas de solution écrite.

Emplacement : `ranking-shorts/src/core/spec.ts`
Vérification : `npm run check` (jamais `start` — on ne fait que des types)

---

## Objectif de la tâche

Modéliser, en TypeScript, à quoi ressemble une vidéo « ranking » —
au moins la partie « source de fond d'un item ». C'est le socle dont
toutes les autres couches (renderer, éditeur, API) dépendront.

Contrainte ferme : **une seule variante de source pour la V1**
(le fichier local). L'union doit être écrite pour qu'ajouter « url »
plus tard soit un simple ajout, mais tu n'ajoutes rien maintenant.

---

## Ordre de construction

### 1. Le type `Source` (le cœur de la session)

Une union discriminée avec, pour la V1, un seul membre : la source
« fichier ». Repense à la section 3 des exercices.

Questions à te poser pour le concevoir :
- quel champ joue le rôle de discriminant ?
- que contient la variante « fichier » en plus du discriminant ?
- si tu ajoutais « url » demain, qu'est-ce qui changerait ? (rien ne
  doit être à réécrire — juste un membre à ajouter)

### 2. Le type d'un item de ranking

Un item, c'est un rang (1 à 5) + une source + le texte affiché.
À toi de décider les champs. Pense à ce qu'il faut RÉELLEMENT pour
dessiner une ligne du classement, rien de plus (pas de sur-ingénierie).

### 3. Le type `Spec` (la vidéo complète)

La spec décrit une vidéo entière. Réfléchis à ce qui est propre à la
vidéo (et pas à un item) : un titre, des dimensions, un framerate,
et la liste des items.

Indice de méthode : les dimensions et le fps ne changent jamais après
création → repense à `readonly` (session 2). Le format vertical est
fixe (1080×1920) → une valeur littérale plutôt qu'un `number` libre
est-elle plus juste ? À toi de trancher.

### 4. Un consommateur avec switch exhaustif

Écris une petite fonction qui « consomme » une source (par ex. une
fonction qui retourne une description texte de la source). Utilise le
`switch` sur le discriminant AVEC la garde `never` de la section 4.

C'est ce qui rendra l'ajout futur d'« url » sûr : le jour où tu
ajouteras la variante, `npm run check` te pointera exactement cette
fonction comme « cas non géré ». Teste-le : ajoute mentalement une
variante et vérifie que tu vois où ça casserait.

### 5. Une spec d'exemple

Dans `examples/`, crée un `demo.json` : une vidéo ranking plausible
avec un titre et 3 à 5 items pointant vers des fichiers locaux
(chemins fictifs pour l'instant, tu n'as pas encore les clips).
Ça te servira d'entrée de test dès la Phase 2.

---

## Ce qui est HORS périmètre (ne le fais pas maintenant)

- la variante « url » de Source → session/version ultérieure
- la validation du JSON (vérifier qu'un fichier reçu est conforme)
  → c'est Zod, session 7. Ici tu ne fais que TYPER, pas VALIDER.
- toute logique de rendu, de position, de couleur d'overlay
  → Phase 2. Reste sur la structure de données.

Si tu te surprends à écrire autre chose que des types et une petite
fonction de démonstration, tu débordes. Recentre.

---

## Validé quand

- [ ] `npm run check` est propre
- [ ] `Source` est une union discriminée à un membre, prête à s'étendre
- [ ] un `switch` sur la source est protégé par `never`
- [ ] `examples/demo.json` existe et correspond à ta forme de Spec
- [ ] commit côté ranking-shorts : `feat: modélise la spec (source, item, spec)`

---

## Comment je peux t'aider sans te voler l'exercice

- tu me colles ton `Source` / ta `Spec` → je te dis si le discriminant
  est bien posé et si la structure s'étendra sans douleur
- tu me colles une erreur `tsc` incomprise → on la décode ensemble
- tu hésites entre deux façons de modéliser un champ → on en discute,
  tu tranches

Ce que je ne fais pas : écrire les types à ta place. Montre-moi
d'abord ce que tu as tenté.
