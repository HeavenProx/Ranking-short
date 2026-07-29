# Session 7 — Application projet : valider la spec avec Zod

Guide d'aiguillage. Quoi construire, dans quel ordre. Les schémas
eux-mêmes restent ton exercice.

Emplacement : `ranking-shorts/src/core/`
Installer d'abord : `npm install zod` (dans le repo du projet)

---

## Objectif

Jusqu'ici ta `Spec` (session 6) n'est qu'un TYPE : elle décrit la forme,
mais rien ne vérifie qu'un `demo.json` reçu la respecte vraiment. Un
fichier malformé passerait, et planterait plus tard dans le renderer.

Aujourd'hui tu ajoutes la couche qui PROUVE, à l'exécution, qu'une donnée
entrante est une Spec valide — ou la refuse avec un message clair.

---

## Ordre de construction

### 1. sourceSchema

Le schéma Zod qui correspond à ton type `Source` de la session 6.
Comme c'était une union discriminée, cherche la méthode Zod dédiée
aux unions discriminées (elle prend le nom du champ discriminant).

### 2. itemSchema

Le schéma d'un item : rang, source (réutilise sourceSchema), texte.
Profites-en pour poser de vraies contraintes que le type seul ne
pouvait pas exprimer :
- le rang est-il borné (1 à 5) ?
- le texte a-t-il une longueur minimale ?

C'est la valeur ajoutée de Zod sur TypeScript : les RÈGLES, pas juste
les types.

### 3. specSchema

Le schéma de la vidéo complète : titre, dimensions, fps, liste d'items
(un tableau d'itemSchema). Pense aux contraintes : dimensions et fps
positifs, liste non vide, etc.

### 4. Une fonction de chargement

Une fonction qui :
- lit `examples/demo.json` (fs) et le parse en objet (JSON.parse)
- le confronte à specSchema via safeParse
- si valide : retourne la spec (désormais typée ET prouvée)
- si invalide : affiche quels champs posent problème et s'arrête
  proprement (pas de plantage brut)

C'est le cœur de la session : le point où une donnée `unknown` venue
d'un fichier devient une Spec fiable.

### 5. Tester les deux chemins

- lance sur ton `demo.json` valide → doit passer
- casse volontairement le JSON (enlève le titre, mets un rang à 99,
  un fps négatif) → doit être refusé avec un message lisible

Le second test est le plus important : c'est lui qui prouve que ta
validation sert à quelque chose.

---

## Le piège à éviter : la double source de vérité

Tu as maintenant, en double, ton TYPE `Spec` (session 6) ET ton
specSchema (aujourd'hui). Ils décrivent la même chose. Les maintenir
tous les deux à la main, c'est la garantie qu'ils divergeront un jour.

NE le règle PAS maintenant. C'est exactement le sujet de la session 8
(`z.infer` : dériver le type depuis le schéma). Pour aujourd'hui,
accepte la duplication ; note-la juste dans un coin comme "à unifier
session 8". C'est volontaire et pédagogique de la vivre avant de la
résoudre.

---

## Validé quand

- [ ] specSchema valide ton demo.json
- [ ] un JSON cassé est refusé avec un message clair (champ + raison)
- [ ] `npm run check` propre
- [ ] commit : `feat: validation de la spec avec Zod`

---

## Comment je t'aide

- tu me colles un schéma → je te dis s'il est cohérent avec ton type
  et si les contraintes sont bien placées
- une erreur Zod ou tsc incomprise → on la décode
- un doute sur parse/safeParse dans un cas précis → on en parle

Je n'écris pas les schémas à ta place. Montre ce que tu as tenté.
