# Phase 2 · Session 1 — Charger une spec depuis un fichier

Guide d'aiguillage : il te dit QUOI construire et POURQUOI.
Le code reste ton exercice — aucune solution écrite ici.

Emplacement : `ranking-shorts/`
Vérification : `npm run check`

---

## En une phrase

Ton `loadSpec` actuel fait trois choses. On le **coupe en deux** : la
lecture disque part dans `cli/`, la validation reste dans `core/`.

⚠️ Ce n'est PAS un simple déplacement de fichier. C'est une coupure.

---

## Ce que fait ton code aujourd'hui

`core/load-spec.ts` enchaîne trois actions :

| # | Action | Outil |
|---|--------|-------|
| 1 | Lire le fichier | `readFileSync` |
| 2 | Transformer en objet | `JSON.parse` |
| 3 | Valider la forme | `safeParse` |

**La coupure passe entre 2 et 3.**

```
        AVANT                          APRÈS

  core/load-spec.ts             cli/charger-spec.ts
    ├── lire      ──────────────►  ├── lire
    ├── parser    ──────────────►  ├── parser
    └── valider   ───┐             └── appelle ↓
                     │
                     └──────────►  core/valider-spec.ts
                                     └── valider
```

Le core **perd** la lecture et **garde** la validation.

---

## Pourquoi cette frontière (lis ça avant de coder)

En Phase 3-4, ton core devra tourner **dans un navigateur**.

Or `node:fs` n'existe pas dans un navigateur. Tant qu'un fichier de
`core/` importe `node:fs`, tout le core est cloué à Node.

D'où la règle : **le core ne touche jamais au disque.**

Formulé autrement : la `cli` sait LIRE, le core sait VALIDER. Aucune
des deux ne fait le travail de l'autre.

---

## Arborescence cible

```
src/
  core/
    spec.ts          ← schémas + types (ne bouge pas)
    valider-spec.ts  ← validerSpec(donnee: unknown)   AUCUN fs
  cli/
    charger-spec.ts  ← chargerSpec(chemin)            fs + JSON.parse
    index.ts         ← affiche et décide de quitter
```

`core/load-spec.ts` disparaît : sa moitié « valider » devient
`valider-spec.ts`, sa moitié « lire » part dans `cli/charger-spec.ts`.

---

## Ordre de construction

### 1. `core/valider-spec.ts` — la validation pure

Une fonction `validerSpec(donnee: unknown)` qui passe la donnée à ton
`specSchema` via `safeParse`.

Elle ne lit aucun fichier. Elle est testable en lui passant un objet
écrit en dur.

⚠️ **Le point qui change tout : elle ne doit plus ni afficher, ni quitter.**

Ton code actuel fait `console.error` puis `process.exit(1)`. Dans le
core, c'est deux fautes :

- `console.error` → un effet de bord. Une fonction pure calcule, elle
  n'affiche pas.
- `process.exit` → tuer le programme n'est pas la décision d'une brique
  du cœur, c'est celle du programme appelant.

Elle doit donc **retourner** soit la Spec, soit une erreur exploitable.

💡 Indice : tu sais déjà modéliser « soit ceci, soit cela » — c'est une
**union discriminée** (Phase 1, session 6). Un objet qui vaut soit
« réussi + la donnée », soit « échoué + la raison ». Le champ
discriminant te dira lequel.

### 2. `cli/charger-spec.ts` — le chargement

Une fonction `chargerSpec(chemin: string)` qui :

- lit le fichier avec `node:fs/promises` (donc `readFile`, pas
  `readFileSync`) → ta fonction devient `async`
- le parse avec `JSON.parse` → tu obtiens un `unknown`
- passe ce `unknown` à `validerSpec`
- rend la Spec validée, ou remonte l'erreur proprement

⚠️ Conséquence en chaîne : `chargerSpec` étant `async`, `index.ts`
devra l'attendre.

### 3. Distinguer les deux échecs

Il y a deux façons d'échouer, et elles ne se traitent pas pareil :

| Échec | Où il est attrapé | Message attendu |
|-------|-------------------|-----------------|
| Fichier absent ou illisible | `try/catch` autour du `readFile` | « Fichier introuvable : … » |
| Contenu invalide | retour de `validerSpec` | « Spec invalide : champ X … » |

Ton code actuel les mélange dans un seul `catch`. L'utilisateur a
besoin de savoir lequel des deux s'est produit : « je me suis trompé
de chemin » et « mon JSON est mal rempli » n'appellent pas la même
correction.

💡 Rappel : `JSON.parse` lève une exception sur un JSON mal formé,
`safeParse` n'en lève jamais. Ce sont deux mécanismes différents.

### 4. `cli/index.ts` — l'affichage et la sortie

C'est ici, et seulement ici, que vivent `console.error` et
`process.exit`. Le point d'entrée reçoit le résultat, affiche ce qu'il
faut, et décide du code de sortie.

### 5. Tester les trois chemins

```bash
npm start -- examples/demo.json          # → tu récupères la Spec
npm start -- examples/nexistepas.json    # → message d'I/O clair
npm start -- examples/demo-casse.json    # → message de validation clair
```

Les trois doivent produire des messages **différents et lisibles**, et
aucun ne doit afficher de stacktrace brute.

---

## Le piège à éviter

Ne rappelle PAS `JSON.parse` ou `node:fs` dans le core « juste pour
dépanner ». Si tu te retrouves à importer `node:fs` dans un fichier de
`core/`, c'est le signal que la frontière a fuité.

**La vérification, en une commande :**

```bash
grep -rn "node:fs" src/core/
```

Elle doit ne rien retourner.

---

## Validé quand

- [ ] `grep -rn "node:fs" src/core/` ne retourne rien
- [ ] `validerSpec` ne contient ni `console.*` ni `process.exit`
- [ ] `chargerSpec` lit + parse + valide, en `async`
- [ ] les erreurs d'I/O et de validation ont des messages distincts
- [ ] les trois chemins de test se comportent correctement
- [ ] `core/load-spec.ts` a été supprimé
- [ ] `npm run check` propre
- [ ] commit : `feat: chargement de spec depuis un fichier (cli)`

---

## Comment je t'aide

- tu me colles `chargerSpec` et/ou `validerSpec` → je te dis si la
  frontière core/cli est bien tracée
- une erreur tsx/tsc incomprise → on la décode ensemble
- un doute sur « où mettre quoi » → on en discute avant que tu codes

Je n'écris pas les fonctions à ta place. Montre d'abord ta tentative.
