# Session 8 — Application projet : une seule source de vérité + strict

Dernière tâche projet de la Phase 1. Objectif : supprimer la double
définition (types manuels de la session 6 vs schémas Zod de la session 7)
et durcir la configuration TypeScript.

Emplacement : `ranking-shorts/src/core/`

---

## Partie A — unifier

### 1. Dériver au lieu de dupliquer

Tu as aujourd'hui, pour la même chose :
- des types écrits à la main (session 6) : Source, Item, Spec
- des schémas Zod (session 7) : sourceSchema, itemSchema, specSchema

Remplace les types manuels par des types DÉRIVÉS des schémas via
`z.infer`. Concrètement, pour chaque entité : tu gardes le schéma,
tu supprimes l'interface/type manuel, et tu le remplaces par un
`type X = z.infer<typeof xSchema>`.

### 2. Supprimer les doublons

Une fois dérivé, l'ancienne définition manuelle n'a plus de raison
d'être : retire-la. Vérifie qu'aucun import ne pointe encore vers
l'ancienne version.

Résultat visé : dans tout le projet, une entité = un schéma Zod, et
son type en découle. Si tu changes le schéma, le type suit seul.

### 3. Exporter proprement

Le `core/` doit exposer, pour chaque entité, son schéma ET son type
dérivé (les autres couches auront besoin des deux : le schéma pour
valider, le type pour typer). Range ça clairement dans `spec.ts`.

---

## Partie B — durcir le tsconfig

Ajoute ces options dans `compilerOptions` et corrige ce qu'elles
révèlent (il y aura probablement deux ou trois points à traiter) :

```json
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"noImplicitReturns": true,
"forceConsistentCasingInFileNames": true
```

La plus impactante est `noUncheckedIndexedAccess` : accéder à
`monTableau[0]` renverra désormais `T | undefined`, parce que rien ne
garantit que l'index existe. TS va t'obliger à gérer ce cas. C'est
pénible sur le moment, mais c'est exactement le genre de bug
(accès hors limites) qui explose en production. Traite-les, ne les
contourne pas avec `!` ou `as`.

---

## Le test qui prouve que l'unification a marché

Ajoute un champ à UN schéma (par ex. une `couleur` optionnelle sur un
item). Sans toucher à aucun type, lance `npm run check`. Le type dérivé
doit avoir suivi automatiquement, et TS doit répercuter le changement
partout où l'item est utilisé. Si c'est le cas : source unique réussie.
Retire le champ test ensuite.

---

## Validé quand

- [ ] plus aucun type d'entité écrit à la main dans core/ (tout via z.infer)
- [ ] les options strictes sont actives et le code corrigé (zéro `!`/`as` de confort)
- [ ] `npm run check` propre
- [ ] commit : `refactor: types dérivés des schémas + tsconfig strict`

---

## Fin de la Phase 1

À l'issue de cette session, ton `core/` est un module autonome, validé,
fortement typé, sans dépendance au reste — prêt à être consommé par le
renderer (Phase 2), l'éditeur (Phase 3-4) et l'API (Phase 5).

Prochaine étape : Phase 2, le renderer Node. On quitte la modélisation
pure pour produire ta première vidéo. La V1 est en vue.
