export type CodeBlock = {
  lang: string;
  lines: string[];
  output?: string;
  note?: string;
};

export type LessonSection = {
  heading: string;
  body: string[];
  code?: CodeBlock;
  tip?: string;
};

export type Quiz = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  summary: string;
  sections: LessonSection[];
  keyPoints: string[];
  quiz: Quiz[];
};

export type ModuleGroup = {
  module: string;
  lessons: Lesson[];
};

/** Clé : identifiant du cours. Valeur : modules regroupant les leçons. */
export const lessonCatalog: Record<string, ModuleGroup[]> = {
  javascript: [
    {
      module: "Les bases du langage",
      lessons: [
        {
          id: "js-variables",
          title: "Variables et types",
          duration: "12 min",
          summary: "Stocker et réutiliser des données avec let, const et les types primitifs.",
          sections: [
            {
              heading: "Trois mots-clés pour déclarer",
              body: [
                "En JavaScript moderne, on utilise principalement deux mots-clés. let pour une valeur qui peut changer, const pour une référence fixe.",
                "Le mot-clé var existe encore mais il est à éviter : sa portée moins prévisible source des bugs difficiles à trouver.",
              ],
              code: {
                lang: "javascript",
                lines: [
                  "let age = 25;        // modifiable",
                  "const pays = \"FR\";   // constante",
                  "age = 26;            // autorisé",
                  "pays = \"BE\";        // TypeError",
                ],
                output: "La dernière ligne lève une erreur : une const ne peut pas être réassignée.",
              },
            },
            {
              heading: "Les types primitifs",
              body: ["JavaScript est dynamiquement typé : la variable adopte le type de sa valeur. L'opérateur typeof permet de l'inspecter."],
              code: {
                lang: "javascript",
                lines: [
                  "const score = 12;          // number",
                  "const nom = \"Alex\";        // string",
                  "const actif = true;        // boolean",
                  "console.log(typeof nom);   // \"string\"",
                ],
                output: "string",
              },
            },
          ],
          keyPoints: [
            "Privilégiez const par défaut, passez à let seulement si la valeur doit changer.",
            "typeof renvoie le type d'une valeur sous forme de chaîne.",
            "Une const protège la réassignation, mais pas le contenu d'un objet ou d'un tableau.",
          ],
          quiz: [
            {
              q: "Quel mot-clé utiliser pour une valeur qu'on ne réassignera jamais ?",
              options: ["var", "let", "const"],
              answer: 2,
              why: "const crée une référence fixe : impossible de la réassigner ensuite.",
            },
            {
              q: "Que renvoie typeof \"42\" ?",
              options: ["number", "string", "text"],
              answer: 1,
              why: "La valeur est entre guillemets, c'est donc une chaîne de caractères (string).",
            },
          ],
        },
        {
          id: "js-functions",
          title: "Fonctions et portée",
          duration: "14 min",
          summary: "Découper son code en fonctions réutilisables et comprendre la portée des variables.",
          sections: [
            {
              heading: "Déclarer une fonction",
              body: ["Une fonction regroupe des instructions réutilisables. On l'appelle en ajoutant des parenthèses, quitte à lui passer des arguments."],
              code: {
                lang: "javascript",
                lines: [
                  "function saluer(prenom) {",
                  "  return `Bonjour ${prenom}`;",
                  "}",
                  "",
                  "console.log(saluer(\"Lina\"));",
                ],
                output: "Bonjour Lina",
              },
              tip: "Les fonctions fléchées offrent une syntaxe courte : const doubler = (n) => n * 2;",
            },
            {
              heading: "La portée des variables",
              body: ["Une variable déclarée dans un bloc (entre accolades) n'existe qu'à l'intérieur de ce bloc. C'est la portée de bloc."],
              code: {
                lang: "javascript",
                lines: [
                  "function tester() {",
                  "  let secret = 42;",
                  "}",
                  "",
                  "console.log(secret); // ReferenceError",
                ],
                output: "ReferenceError: secret is not defined",
              },
            },
          ],
          keyPoints: [
            "Une fonction peut renvoyer une valeur avec return.",
            "let et const sont limitées au bloc où elles sont déclarées.",
            "Les arguments permettent de passer des données à une fonction.",
          ],
          quiz: [
            {
              q: "Quel mot-clé renvoie un résultat depuis une fonction ?",
              options: ["return", "give", "output"],
              answer: 0,
              why: "return transmet la valeur à l'appelant et termine la fonction.",
            },
            {
              q: "Une variable let déclarée dans une fonction est accessible...",
              options: ["partout dans le programme", "seulement dans cette fonction", "dans le HTML"],
              answer: 1,
              why: "Sa portée se limite au bloc de la fonction : c'est une variable locale.",
            },
          ],
        },
        {
          id: "js-conditions",
          title: "Conditions et boucles",
          duration: "13 min",
          summary: "Prendre des décisions avec if/else et répéter des actions avec les boucles.",
          sections: [
            {
              heading: "Les conditions",
              body: ["On adapte le comportement selon une condition. Les opérateurs de comparaison (> < >= <= ===) produisent un booléen."],
              code: {
                lang: "javascript",
                lines: [
                  "const age = 17;",
                  "if (age >= 18) {",
                  "  console.log(\"Majeur\");",
                  "} else {",
                  "  console.log(\"Mineur\");",
                  "}",
                ],
                output: "Mineur",
              },
            },
            {
              heading: "Les boucles",
              body: ["La boucle for répète un bloc un nombre déterminé de fois, avec un compteur."],
              code: {
                lang: "javascript",
                lines: [
                  "for (let i = 0; i < 3; i++) {",
                  "  console.log(i);   // 0 1 2",
                  "}",
                ],
                output: "0\n1\n2",
              },
              tip: "Préférez === à == : il compare à la fois la valeur ET le type, sans conversion surprise.",
            },
          ],
          keyPoints: [
            "if exécute un bloc seulement si la condition est vraie.",
            "for (let i = 0; i < n; i++) répète n fois.",
            "=== compare valeur et type, contrairement à ==.",
          ],
          quiz: [
            {
              q: "Que produit une boucle for (let i = 0; i < 3; i++) ?",
              options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
              answer: 1,
              why: "On commence à 0 et on s'arrête avant 3 : donc 0, 1, 2.",
            },
            {
              q: "Quel opérateur compare valeur ET type ?",
              options: ["=", "==", "==="],
              answer: 2,
              why: "=== est la comparaison stricte, sans conversion de type.",
            },
          ],
        },
      ],
    },
    {
      module: "DOM et événements",
      lessons: [
        {
          id: "js-dom",
          title: "Manipuler le DOM",
          duration: "13 min",
          summary: "Sélectionner des éléments de la page et modifier leur contenu depuis JavaScript.",
          sections: [
            {
              heading: "Sélectionner un élément",
              body: ["Le DOM est la représentation de la page en objets. On récupère un élément grâce à son sélecteur CSS."],
              code: {
                lang: "javascript",
                lines: [
                  "const titre = document.querySelector(\"h1\");",
                  "titre.textContent = \"Nouveau titre\";",
                ],
                output: "Le titre affiché à l'écran change instantanément.",
              },
            },
            {
              heading: "Modifier des classes",
              body: ["On peut ajouter ou retirer des classes CSS pour changer l'apparence d'un élément."],
              code: {
                lang: "javascript",
                lines: [
                  "const carte = document.querySelector(\".carte\");",
                  "carte.classList.add(\"actif\");",
                  "carte.classList.toggle(\"cache\");",
                ],
              },
            },
          ],
          keyPoints: [
            "querySelector renvoie le premier élément correspondant au sélecteur CSS.",
            "textContent change le texte, classList gère les classes CSS.",
            "Le DOM est mis à jour en direct : les changements apparaissent immédiatement.",
          ],
          quiz: [
            {
              q: "Quelle méthode récupère le premier élément d'un sélecteur CSS ?",
              options: ["getElement", "querySelector", "findNode"],
              answer: 1,
              why: "querySelector accepte un sélecteur CSS comme \"h1\" ou \".carte\".",
            },
            {
              q: "Comment ajouter la classe \"actif\" à un élément ?",
              options: ["el.class = \"actif\"", "el.classList.add(\"actif\")", "el.add(\"actif\")"],
              answer: 1,
              why: "classList.add ajoute proprement une classe sans écraser les autres.",
            },
          ],
        },
        {
          id: "js-events",
          title: "Réagir aux événements",
          duration: "12 min",
          summary: "Exécuter du code quand l'utilisateur clique, tape ou soumet un formulaire.",
          sections: [
            {
              heading: "Écouter un clic",
              body: ["addEventListener relie un événement (clic, saisie…) à une fonction appelée gestionnaire."],
              code: {
                lang: "javascript",
                lines: [
                  "const bouton = document.querySelector(\"button\");",
                  "",
                  "bouton.addEventListener(\"click\", () => {",
                  "  console.log(\"Clic détecté !\");",
                  "});",
                ],
              },
            },
            {
              heading: "L'objet événement",
              body: ["Le gestionnaire reçoit un objet event qui contient des détails utiles sur ce qui s'est passé."],
              code: {
                lang: "javascript",
                lines: [
                  "input.addEventListener(\"input\", (event) => {",
                  "  console.log(event.target.value);",
                  "});",
                ],
                output: "Affiche le texte au fur et à mesure de la frappe.",
              },
              tip: "event.preventDefault() empêche le comportement par défaut, utile pour un formulaire.",
            },
          ],
          keyPoints: [
            "addEventListener associe un type d'événement à une fonction.",
            "event.target désigne l'élément qui a déclenché l'événement.",
            "On peut écouter clic, input, submit, mouseover, etc.",
          ],
          quiz: [
            {
              q: "Quelle méthode relie un événement à une fonction ?",
              options: ["onEvent", "addEventListener", "bind"],
              answer: 1,
              why: "addEventListener(\"click\", fn) écoute l'événement voulu.",
            },
            {
              q: "Comment récupérer la valeur d'un champ dans un événement input ?",
              options: ["event.target.value", "event.value()", "input.text"],
              answer: 0,
              why: "event.target représente le champ, dont .value donne le texte saisi.",
            },
          ],
        },
      ],
    },
    {
      module: "Asynchrone et API",
      lessons: [
        {
          id: "js-async",
          title: "Promesses et async/await",
          duration: "15 min",
          summary: "Gérer les opérations qui prennent du temps grâce aux promesses et à async/await.",
          sections: [
            {
              heading: "Les promesses",
              body: ["Une promesse (Promise) représente une valeur disponible plus tard. On récupère son résultat avec then."],
              code: {
                lang: "javascript",
                lines: [
                  "const promesse = new Promise((resolve) => {",
                  "  setTimeout(() => resolve(\"Prêt !\"), 1000);",
                  "});",
                  "promesse.then((v) => console.log(v));",
                ],
                output: "Prêt ! (après 1 seconde)",
              },
            },
            {
              heading: "async / await",
              body: ["async/await offre une syntaxe plus lisible pour attendre le résultat d'une promesse."],
              code: {
                lang: "javascript",
                lines: [
                  "async function charger() {",
                  "  const resultat = await promesse;",
                  "  console.log(resultat);",
                  "}",
                ],
              },
              tip: "await ne s'utilise qu'à l'intérieur d'une fonction déclarée async.",
            },
          ],
          keyPoints: [
            "Une promesse représente une valeur future.",
            "then() récupère le résultat, await attend qu'elle se réalise.",
            "await ne s'emploie que dans une fonction async.",
          ],
          quiz: [
            {
              q: "Où peut-on utiliser await ?",
              options: ["N'importe où", "Dans une fonction async", "Jamais"],
              answer: 1,
              why: "await est réservé aux fonctions marquées async.",
            },
            {
              q: "Que représente une promesse ?",
              options: ["Une erreur", "Une valeur future", "Une boucle"],
              answer: 1,
              why: "Elle produira (ou non) une valeur plus tard.",
            },
          ],
        },
        {
          id: "js-fetch",
          title: "Consommer une API avec fetch",
          duration: "14 min",
          summary: "Récupérer et afficher des données venant d'un serveur grâce à fetch.",
          sections: [
            {
              heading: "Une requête GET",
              body: ["fetch interroge une adresse (URL) et renvoie une promesse contenant la réponse."],
              code: {
                lang: "javascript",
                lines: [
                  "const reponse = await fetch(\"https://api.ex.fr/donnees\");",
                  "const donnees = await reponse.json();",
                  "console.log(donnees);",
                ],
                output: "Affiche les données reçues, déjà converties en objet JavaScript.",
              },
            },
            {
              heading: "Vérifier la réussite",
              body: ["fetch ne lève pas d'erreur pour un code HTTP 404 : il faut tester reponse.ok soi-même."],
              code: {
                lang: "javascript",
                lines: [
                  "if (!reponse.ok) {",
                  "  throw new Error(\"Échec de la requête\");",
                  "}",
                ],
              },
              tip: "json() renvoie aussi une promesse : on l'attend avec un second await.",
            },
          ],
          keyPoints: [
            "fetch() renvoie une promesse : on l'attend avec await.",
            "reponse.json() convertit le corps en objet JavaScript.",
            "Vérifiez toujours reponse.ok avant d'utiliser les données.",
          ],
          quiz: [
            {
              q: "Que renvoie fetch() ?",
              options: ["Un objet", "Une promesse", "Un nombre"],
              answer: 1,
              why: "fetch est asynchrone : il renvoie une promesse de réponse.",
            },
            {
              q: "Comment convertir la réponse en objet JavaScript ?",
              options: ["reponse.parse()", "reponse.json()", "reponse.toObject()"],
              answer: 1,
              why: "json() lit et convertit le corps de la réponse.",
            },
          ],
        },
      ],
    },
    {
      module: "Projet final",
      lessons: [
        {
          id: "js-storage",
          title: "Sauvegarder avec localStorage",
          duration: "11 min",
          summary: "Conserver des données simples dans le navigateur, même après fermeture de la page.",
          sections: [
            {
              heading: "Enregistrer et lire",
              body: ["localStorage stocke des paires clé/valeur qui survivent au rechargement de la page."],
              code: {
                lang: "javascript",
                lines: [
                  "localStorage.setItem(\"theme\", \"sombre\");",
                  "const theme = localStorage.getItem(\"theme\");",
                  "console.log(theme);",
                ],
                output: "sombre",
              },
            },
            {
              heading: "Supprimer une valeur",
              body: ["On retire une entrée par sa clé, ou tout effacer d'un coup."],
              code: {
                lang: "javascript",
                lines: [
                  "localStorage.removeItem(\"theme\");",
                  "localStorage.clear();",
                ],
              },
              tip: "localStorage ne stocke que des chaînes : utilisez JSON.stringify pour un objet ou un tableau.",
            },
          ],
          keyPoints: [
            "setItem enregistre, getItem lit, removeItem supprime.",
            "Les données persistent après fermeture de l'onglet.",
            "On ne peut y stocker que des chaînes de caractères.",
          ],
          quiz: [
            {
              q: "Quelle méthode enregistre une valeur ?",
              options: ["setItem", "save", "write"],
              answer: 0,
              why: "localStorage.setItem(clé, valeur) enregistre la paire.",
            },
            {
              q: "Quel type de données localStorage peut-il stocker directement ?",
              options: ["Des objets", "Des chaînes", "Des images"],
              answer: 1,
              why: "Seules les chaînes ; on sérialise les objets avec JSON.stringify.",
            },
          ],
        },
        {
          id: "js-project",
          title: "Projet : une liste de tâches",
          duration: "18 min",
          summary: "Assembler variables, événements, DOM et stockage dans une mini-application.",
          sections: [
            {
              heading: "Stocker les tâches",
              body: ["On sépare les données (un tableau) de l'affichage (le DOM). Une fonction ajoute une tâche puis rafraîchit l'écran."],
              code: {
                lang: "javascript",
                lines: [
                  "const taches = [];",
                  "function ajouter(texte) {",
                  "  taches.push(texte);",
                  "  afficher();",
                  "}",
                ],
              },
            },
            {
              heading: "Persister les données",
              body: ["À chaque changement, on sauvegarde le tableau pour ne rien perdre au rechargement."],
              code: {
                lang: "javascript",
                lines: [
                  "localStorage.setItem(\"taches\",",
                  "  JSON.stringify(taches));",
                ],
              },
              tip: "Écoutez la soumission du formulaire (submit) pour ajouter une tâche proprement.",
            },
          ],
          keyPoints: [
            "On sépare les données (tableau) et l'affichage (DOM).",
            "On sauvegarde dans localStorage à chaque modification.",
            "Le formulaire permet d'ajouter une tâche via l'événement submit.",
          ],
          quiz: [
            {
              q: "Comment convertir un tableau en chaîne pour le stockage ?",
              options: ["String()", "JSON.stringify()", "toString(taches)"],
              answer: 1,
              why: "JSON.stringify produit une chaîne reproductible, relisible avec JSON.parse.",
            },
            {
              q: "Quel événement écouter pour ajouter une tâche via un formulaire ?",
              options: ["submit", "send", "enter"],
              answer: 0,
              why: "Le formulaire émet submit quand on le valide.",
            },
          ],
        },
      ],
    },
  ],
  python: [
    {
      module: "Syntaxe essentielle",
      lessons: [
        {
          id: "py-variables",
          title: "Variables et opérateurs",
          duration: "11 min",
          summary: "Stocker des valeurs et les manipuler avec les opérateurs de base.",
          sections: [
            {
              heading: "Des variables sans déclaration",
              body: ["En Python, on crée une variable en lui attribuant simplement une valeur. Le type est deviné automatiquement."],
              code: {
                lang: "python",
                lines: [
                  "nom = \"Alex\"",
                  "age = 25",
                  "print(nom, \"a\", age, \"ans\")",
                ],
                output: "Alex a 25 ans",
              },
            },
            {
              heading: "Opérateurs et f-strings",
              body: ["Les opérateurs mathématiques sont classiques. Les f-strings permettent d'insérer des variables dans du texte."],
              code: {
                lang: "python",
                lines: [
                  "total = 3 + 2 * 4      # 11",
                  "moyenne = total / 2    # 5.5",
                  "print(f\"Total = {total}\")",
                ],
                output: "Total = 11",
              },
              tip: "True et False s'écrivent toujours avec une majuscule en Python.",
            },
          ],
          keyPoints: [
            "Pas de mot-clé pour déclarer : on assigne directement.",
            "Le type est dynamique : type(x) l'affiche.",
            "Les f-strings (f\"...\") insèrent des variables entre accolades.",
          ],
          quiz: [
            {
              q: "Que vaut 3 + 2 * 4 ?",
              options: ["20", "11", "14"],
              answer: 1,
              why: "La multiplication est prioritaire : 2*4 = 8, puis 3 + 8 = 11.",
            },
            {
              q: "Comment s'écrit le booléen vrai en Python ?",
              options: ["true", "True", "TRUE"],
              answer: 1,
              why: "Python utilise une majuscule : True et False.",
            },
          ],
        },
        {
          id: "py-control",
          title: "Structures de contrôle",
          duration: "13 min",
          summary: "Prendre des décisions avec if/elif/else et répéter avec les boucles.",
          sections: [
            {
              heading: "Les conditions",
              body: ["Python utilise l'indentation (4 espaces) pour délimiter les blocs, pas d'accolades."],
              code: {
                lang: "python",
                lines: [
                  "note = 14",
                  "if note >= 16:",
                  "    print(\"Très bien\")",
                  "elif note >= 10:",
                  "    print(\"Reçu\")",
                  "else:",
                  "    print(\"À refaire\")",
                ],
                output: "Reçu",
              },
            },
            {
              heading: "Les boucles",
              body: ["La boucle for parcourt une séquence. range(n) génère les nombres de 0 à n-1."],
              code: {
                lang: "python",
                lines: [
                  "for i in range(3):",
                  "    print(i)        # 0 1 2",
                  "",
                  "n = 0",
                  "while n < 3:",
                  "    n += 1",
                ],
              },
            },
          ],
          keyPoints: [
            "L'indentation définit les blocs de code.",
            "elif permet d'enchaîner plusieurs conditions.",
            "range(3) produit 0, 1, 2 (le 3 est exclu).",
          ],
          quiz: [
            {
              q: "Que produit range(3) ?",
              options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
              answer: 1,
              why: "range(n) va de 0 jusqu'à n-1, donc 0, 1, 2.",
            },
            {
              q: "Qu'est-ce qui délimite un bloc en Python ?",
              options: ["Des accolades { }", "L'indentation", "Des points-virgules"],
              answer: 1,
              why: "Python se fie à l'indentation (en général 4 espaces).",
            },
          ],
        },
      ],
    },
    {
      module: "Fonctions et objets",
      lessons: [
        {
          id: "py-functions",
          title: "Définir des fonctions",
          duration: "12 min",
          summary: "Créer des fonctions réutilisables avec def, des paramètres et une valeur de retour.",
          sections: [
            {
              heading: "Le mot-clé def",
              body: ["Une fonction se définit avec def, suivi de son nom, de ses paramètres entre parenthèses et de deux points."],
              code: {
                lang: "python",
                lines: [
                  "def aire_rectangle(largeur, hauteur):",
                  "    return largeur * hauteur",
                  "",
                  "print(aire_rectangle(3, 4))",
                ],
                output: "12",
              },
            },
            {
              heading: "Valeurs par défaut",
              body: ["On peut donner une valeur par défaut à un paramètre : il devient optionnel à l'appel."],
              code: {
                lang: "python",
                lines: [
                  "def saluer(nom, message=\"Bonjour\"):",
                  "    return f\"{message}, {nom}\"",
                  "",
                  "print(saluer(\"Lina\"))",
                ],
                output: "Bonjour, Lina",
              },
            },
          ],
          keyPoints: [
            "def crée une fonction, return renvoie un résultat.",
            "Les paramètres peuvent avoir des valeurs par défaut.",
            "Une fonction sans return renvoie implicitement None.",
          ],
          quiz: [
            {
              q: "Quel mot-clé définit une fonction ?",
              options: ["function", "def", "func"],
              answer: 1,
              why: "En Python, c'est def suivi du nom et des paramètres.",
            },
            {
              q: "Que renvoie une fonction sans return explicite ?",
              options: ["0", "une erreur", "None"],
              answer: 2,
              why: "Sans return, Python renvoie None par défaut.",
            },
          ],
        },
        {
          id: "py-collections",
          title: "Listes et dictionnaires",
          duration: "14 min",
          summary: "Stocker plusieurs valeurs dans des listes ordonnées et des dictionnaires clé/valeur.",
          sections: [
            {
              heading: "Les listes",
              body: ["Une liste est une collection ordonnée et modifiable. On accède à un élément par son index, à partir de 0."],
              code: {
                lang: "python",
                lines: [
                  "fruits = [\"pomme\", \"poire\", \"kiwi\"]",
                  "fruits.append(\"banane\")",
                  "print(fruits[0])     # pomme",
                  "print(len(fruits))   # 4",
                ],
                output: "pomme",
              },
            },
            {
              heading: "Les dictionnaires",
              body: ["Un dictionnaire associe des clés à des valeurs, comme un annuaire."],
              code: {
                lang: "python",
                lines: [
                  "etudiant = {\"nom\": \"Alex\", \"age\": 25}",
                  "etudiant[\"age\"] = 26",
                  "print(etudiant[\"nom\"])",
                ],
                output: "Alex",
              },
              tip: "On parcourt un dictionnaire avec for cle, valeur in dico.items():",
            },
          ],
          keyPoints: [
            "Les listes utilisent des index (à partir de 0).",
            "Les dictionnaires associent des clés à des valeurs.",
            "append ajoute un élément en fin de liste.",
          ],
          quiz: [
            {
              q: "Quel est l'index du premier élément d'une liste ?",
              options: ["1", "0", "-1"],
              answer: 1,
              why: "En Python comme dans la plupart des langages, on commence à 0.",
            },
            {
              q: "Quelle structure associe des clés à des valeurs ?",
              options: ["Une liste", "Un dictionnaire", "Un tuple"],
              answer: 1,
              why: "Le dictionnaire {clé: valeur} fait exactement cela.",
            },
          ],
        },
      ],
    },
    {
      module: "Fichiers et données",
      lessons: [
        {
          id: "py-file",
          title: "Lire et écrire des fichiers",
          duration: "13 min",
          summary: "Ouvrir, lire et écrire des fichiers texte en toute sécurité.",
          sections: [
            {
              heading: "Lire un fichier",
              body: ["Le bloc with ouvre le fichier et le ferme automatiquement, même en cas d'erreur."],
              code: {
                lang: "python",
                lines: [
                  "with open(\"donnees.txt\", \"r\") as f:",
                  "    contenu = f.read()",
                  "print(contenu)",
                ],
                output: "Affiche tout le contenu du fichier.",
              },
            },
            {
              heading: "Écrire dans un fichier",
              body: ["Le mode \"w\" crée ou écrase le fichier. On utilise write pour y déposer du texte."],
              code: {
                lang: "python",
                lines: [
                  "with open(\"sortie.txt\", \"w\") as f:",
                  "    f.write(\"Bonjour\\n\")",
                ],
              },
              tip: "Le mode \"a\" (append) ajoute à la fin du fichier sans l'écraser.",
            },
          ],
          keyPoints: [
            "\"r\" pour lire, \"w\" pour écrire, \"a\" pour ajouter.",
            "with open(...) garantit la fermeture du fichier.",
            "read() lit tout, readlines() lit ligne par ligne.",
          ],
          quiz: [
            {
              q: "Quel mode ouvre un fichier en écriture (en écrasant) ?",
              options: ["\"r\"", "\"w\"", "\"a\""],
              answer: 1,
              why: "\"w\" (write) crée ou remplace le fichier.",
            },
            {
              q: "Quel est l'avantage du bloc with ?",
              options: ["Il accélère la lecture", "Il ferme le fichier automatiquement", "Il crypte les données"],
              answer: 1,
              why: "with garantit la fermeture, même si une erreur survient.",
            },
          ],
        },
        {
          id: "py-exceptions",
          title: "Gérer les erreurs",
          duration: "12 min",
          summary: "Anticiper et traiter les erreurs sans faire planter le programme.",
          sections: [
            {
              heading: "try / except",
              body: ["On place le code risqué dans try et on traite l'erreur dans except selon son type."],
              code: {
                lang: "python",
                lines: [
                  "try:",
                  "    valeur = int(\"abc\")",
                  "except ValueError:",
                  "    print(\"Ce n'est pas un nombre\")",
                ],
                output: "Ce n'est pas un nombre",
              },
            },
            {
              heading: "Plusieurs types d'erreurs",
              body: ["On peut prévoir plusieurs branches except pour réagir différemment selon l'erreur."],
              code: {
                lang: "python",
                lines: [
                  "try:",
                  "    resultat = 10 / 0",
                  "except ZeroDivisionError:",
                  "    print(\"Division par zéro\")",
                ],
              },
              tip: "Évitez le except vide (sans type) : il masquerait de vraies erreurs.",
            },
          ],
          keyPoints: [
            "Le code risqué se place dans un bloc try.",
            "except récupère l'erreur, idéalement par son type.",
            "On peut chaîner plusieurs except pour différents cas.",
          ],
          quiz: [
            {
              q: "Où place-t-on le code qui peut échouer ?",
              options: ["Dans except", "Dans try", "Dans error"],
              answer: 1,
              why: "try entoure les instructions à risque.",
            },
            {
              q: "Comment gérer spécifiquement une erreur de conversion ?",
              options: ["except Error", "except ValueError", "catch int"],
              answer: 1,
              why: "int() lève une ValueError quand la conversion échoue.",
            },
          ],
        },
      ],
    },
    {
      module: "Projet d'automatisation",
      lessons: [
        {
          id: "py-modules",
          title: "Importer des modules",
          duration: "11 min",
          summary: "Réutiliser le code de la bibliothèque standard et organiser ses propres fichiers.",
          sections: [
            {
              heading: "Importer un module",
              body: ["Un module regroupe des fonctions prêtes à l'emploi. On y accède avec import puis le nom du module."],
              code: {
                lang: "python",
                lines: [
                  "import math",
                  "print(math.sqrt(16))   # 4.0",
                ],
                output: "4.0",
              },
            },
            {
              heading: "Import ciblé",
              body: ["from ... import permet de n'importer qu'un élément précis, utilisé directement."],
              code: {
                lang: "python",
                lines: [
                  "from random import randint",
                  "print(randint(1, 6))",
                ],
                output: "Un nombre au hasard entre 1 et 6.",
              },
              tip: "math, random et datetime font partie de la bibliothèque standard : rien à installer.",
            },
          ],
          keyPoints: [
            "import module donne accès à module.fonction().",
            "from module import x importe un élément précis.",
            "La bibliothèque standard fournit déjà des dizaines d'outils.",
          ],
          quiz: [
            {
              q: "Quelle fonction calcule une racine carrée ?",
              options: ["math.root", "math.sqrt", "sqrt()"],
              answer: 1,
              why: "Après import math, on utilise math.sqrt().",
            },
            {
              q: "Comment importer uniquement randint ?",
              options: ["import randint", "from random import randint", "use randint"],
              answer: 1,
              why: "from random import randint ramène la fonction directement.",
            },
          ],
        },
        {
          id: "py-project",
          title: "Projet : automatiser une tâche",
          duration: "16 min",
          summary: "Combiner fichiers, boucles et fonctions pour automatiser un traitement répétitif.",
          sections: [
            {
              heading: "Une fonction dédiée",
              body: ["On isole chaque responsabilité dans une petite fonction testable séparément."],
              code: {
                lang: "python",
                lines: [
                  "def compter_lignes(nom_fichier):",
                  "    with open(nom_fichier) as f:",
                  "        return len(f.readlines())",
                ],
              },
            },
            {
              heading: "Lancer le traitement",
              body: ["On appelle la fonction et on réutilise les modules standards pour aller plus loin."],
              code: {
                lang: "python",
                lines: [
                  "total = compter_lignes(\"notes.txt\")",
                  "print(f\"{total} lignes lues\")",
                ],
              },
              tip: "Testez chaque fonction isolément avant de tout assembler : c'est plus simple à déboguer.",
            },
          ],
          keyPoints: [
            "On découpe le traitement en petites fonctions.",
            "On réutilise les modules standards plutôt que de tout réécrire.",
            "On teste chaque brique séparément avant l'assemblage.",
          ],
          quiz: [
            {
              q: "Comment rendre un traitement réutilisable ?",
              options: ["Tout mettre dans une boucle", "Le placer dans une fonction", "Le copier partout"],
              answer: 1,
              why: "Une fonction factorise et réutilise le code.",
            },
            {
              q: "Comment compter les lignes d'un fichier ouvert f ?",
              options: ["f.count()", "len(f.readlines())", "f.lines()"],
              answer: 1,
              why: "readlines() renvoie la liste des lignes ; len() donne leur nombre.",
            },
          ],
        },
      ],
    },
  ],
  "html-css": [
    {
      module: "HTML sémantique",
      lessons: [
        {
          id: "html-structure",
          title: "Structure d'une page",
          duration: "10 min",
          summary: "Comprendre la charpente d'un document HTML : head, body et métadonnées.",
          sections: [
            {
              heading: "La charpente HTML",
              body: ["Tout document HTML commence par la même base : une déclaration, puis head (informations) et body (contenu visible)."],
              code: {
                lang: "html",
                lines: [
                  "<!DOCTYPE html>",
                  "<html lang=\"fr\">",
                  "  <head>",
                  "    <meta charset=\"UTF-8\">",
                  "    <title>Mon site</title>",
                  "  </head>",
                  "  <body>",
                  "    <h1>Bienvenue</h1>",
                  "  </body>",
                  "</html>",
                ],
              },
            },
            {
              heading: "Les balises sémantiques",
              body: ["Les balises sémantiques décrivent le rôle du contenu : header, nav, main, article, footer. Elles améliorent l'accessibilité et le référencement."],
              code: {
                lang: "html",
                lines: [
                  "<header> En-tête du site </header>",
                  "<main>",
                  "  <article>Un contenu autonome</article>",
                  "</main>",
                  "<footer> Bas de page </footer>",
                ],
              },
              tip: "L'attribut lang=\"fr\" aide les lecteurs d'écran à prononcer correctement le texte.",
            },
          ],
          keyPoints: [
            "head contient les métadonnées, body le contenu visible.",
            "Les balises sémantiques (header, main, footer) donnent du sens.",
            "meta charset=\"UTF-8\" gère les accents et caractères spéciaux.",
          ],
          quiz: [
            {
              q: "Où place-t-on le contenu visible de la page ?",
              options: ["Dans <head>", "Dans <body>", "Dans <title>"],
              answer: 1,
              why: "Tout ce qui s'affiche va dans <body>.",
            },
            {
              q: "Quelle balise représente un contenu autonome ?",
              options: ["<div>", "<article>", "<span>"],
              answer: 1,
              why: "<article> est sémantique, <div> et <span> sont neutres.",
            },
          ],
        },
        {
          id: "html-tags",
          title: "Balises essentielles",
          duration: "11 min",
          summary: "Texte, liens, images et listes : les briques de base du contenu.",
          sections: [
            {
              heading: "Texte et liens",
              body: ["Les titres vont de h1 à h6. La balise a crée un lien grâce à son attribut href."],
              code: {
                lang: "html",
                lines: [
                  "<h2>Titre de section</h2>",
                  "<p>Un texte <strong>important</strong>.</p>",
                  "<a href=\"https://ex.fr\">Visiter le site</a>",
                ],
              },
            },
            {
              heading: "Images et listes",
              body: ["Une image nécessite l'attribut alt, essentiel pour l'accessibilité. Les listes peuvent être ordonnées ou non."],
              code: {
                lang: "html",
                lines: [
                  "<img src=\"logo.png\" alt=\"Logo de l'entreprise\">",
                  "<ul>",
                  "  <li>Pommes</li>",
                  "  <li>Poires</li>",
                  "</ul>",
                ],
              },
            },
          ],
          keyPoints: [
            "Une seule balise <h1> par page, idéalement.",
            "L'attribut alt décrit l'image pour les lecteurs d'écran.",
            "<ul> = liste à puces, <ol> = liste numérotée.",
          ],
          quiz: [
            {
              q: "Quel attribut d'image est indispensable pour l'accessibilité ?",
              options: ["src", "alt", "title"],
              answer: 1,
              why: "alt décrit l'image si elle ne s'affiche pas ou pour les lecteurs d'écran.",
            },
            {
              q: "Quelle balise crée une liste numérotée ?",
              options: ["<ul>", "<ol>", "<li>"],
              answer: 1,
              why: "<ol> (ordered list) numérote les éléments.",
            },
          ],
        },
      ],
    },
    {
      module: "Maîtriser CSS",
      lessons: [
        {
          id: "css-selectors",
          title: "Sélecteurs et couleurs",
          duration: "12 min",
          summary: "Cibler des éléments avec des sélecteurs et leur appliquer des couleurs.",
          sections: [
            {
              heading: "Cibler avec des sélecteurs",
              body: ["Un sélecteur désigne les éléments à styliser. On cible une balise, une classe (avec un point) ou un identifiant (avec un dièse)."],
              code: {
                lang: "css",
                lines: [
                  "h1 { color: navy; }",
                  ".btn { color: white; }",
                  "#titre { font-size: 2rem; }",
                ],
              },
            },
            {
              heading: "Définir des couleurs",
              body: ["On peut utiliser des noms, des codes hexadécimaux ou la notation rgb()."],
              code: {
                lang: "css",
                lines: [
                  "p { color: #ff6b47; }",
                  "span { color: rgb(0, 128, 255); }",
                  ".alerte { background: tomato; }",
                ],
              },
              tip: "Le code hexadécimal commence toujours par #, suivi de 6 chiffres/lettres.",
            },
          ],
          keyPoints: [
            "Le point . cible une classe, le dièse # un identifiant.",
            "Les couleurs peuvent être hexadécimales (#rrvvbb) ou rgb().",
            "Un id doit être unique dans la page.",
          ],
          quiz: [
            {
              q: "Quel préfixe cible une classe CSS ?",
              options: ["#", ".", "@"],
              answer: 1,
              why: "On écrit .ma-classe pour cibler une classe.",
            },
            {
              q: "Par quoi commence un code couleur hexadécimal ?",
              options: ["rgb(", "#", "$"],
              answer: 1,
              why: "Exemple : #ff6b47 représente une couleur.",
            },
          ],
        },
        {
          id: "css-box",
          title: "Le modèle de boîte",
          duration: "13 min",
          summary: "Comprendre comment largeur, marges, bordures et remplissage s'articulent.",
          sections: [
            {
              heading: "Le box model",
              body: ["Chaque élément est une boîte composée du contenu, puis du remplissage (padding), de la bordure et de la marge extérieure."],
              code: {
                lang: "css",
                lines: [
                  ".carte {",
                  "  width: 200px;",
                  "  padding: 16px;",
                  "  border: 2px solid #ccc;",
                  "  margin: 12px;",
                  "}",
                ],
              },
            },
            {
              heading: "box-sizing pour éviter les surprises",
              body: ["Par défaut, padding et bordure s'ajoutent à la largeur. box-sizing: border-box les inclut dans la dimension déclarée."],
              code: {
                lang: "css",
                lines: [
                  "* {",
                  "  box-sizing: border-box;",
                  "}",
                ],
              },
              tip: "Appliquer border-box à tous les éléments simplifie énormément les mises en page.",
            },
          ],
          keyPoints: [
            "padding = espace à l'intérieur de la bordure, margin = à l'extérieur.",
            "box-sizing: border-box inclut padding et bordure dans la largeur.",
            "Le contenu se trouve au centre de la boîte.",
          ],
          quiz: [
            {
              q: "Quelle propriété gère l'espace à l'intérieur de la bordure ?",
              options: ["margin", "padding", "border"],
              answer: 1,
              why: "padding est l'espace entre le contenu et la bordure.",
            },
            {
              q: "Quelle valeur inclut padding et bordure dans la largeur ?",
              options: ["box-sizing: border-box", "width: auto", "display: block"],
              answer: 0,
              why: "border-box évite que padding et bordure ne dépassent la largeur prévue.",
            },
          ],
        },
      ],
    },
    {
      module: "Responsive design",
      lessons: [
        {
          id: "css-flexbox",
          title: "Flexbox",
          duration: "13 min",
          summary: "Aligner et répartir facilement des éléments en ligne ou en colonne.",
          sections: [
            {
              heading: "Le conteneur flex",
              body: ["display: flex transforme un élément en conteneur. Ses enfants se placent alors en ligne et se répartissent l'espace."],
              code: {
                lang: "css",
                lines: [
                  ".menu {",
                  "  display: flex;",
                  "  gap: 12px;",
                  "  justify-content: space-between;",
                  "}",
                ],
              },
            },
            {
              heading: "Centrer du contenu",
              body: ["Flexbox rend le centrage trivial, une opération autrefois fastidieuse en CSS."],
              code: {
                lang: "css",
                lines: [
                  ".centre {",
                  "  display: flex;",
                  "  align-items: center;",
                  "  justify-content: center;",
                  "}",
                ],
              },
              tip: "justify-content agit sur l'axe principal, align-items sur l'axe secondaire.",
            },
          ],
          keyPoints: [
            "display: flex active la disposition flexible.",
            "gap ajoute un espace régulier entre les éléments.",
            "justify-content répartit les éléments sur l'axe principal.",
          ],
          quiz: [
            {
              q: "Quelle propriété active Flexbox ?",
              options: ["display: flex", "layout: row", "flex: on"],
              answer: 0,
              why: "display: flex transforme l'élément en conteneur flexible.",
            },
            {
              q: "Quelle propriété espace les éléments flex ?",
              options: ["space", "gap", "padding-between"],
              answer: 1,
              why: "gap ajoute un écart entre chaque enfant.",
            },
          ],
        },
        {
          id: "css-media",
          title: "Les media queries",
          duration: "12 min",
          summary: "Adapter la mise en page à la taille de l'écran (mobile, tablette, ordinateur).",
          sections: [
            {
              heading: "Une règle responsive",
              body: ["@media applique des styles seulement quand une condition d'écran est remplie."],
              code: {
                lang: "css",
                lines: [
                  "@media (max-width: 600px) {",
                  "  .menu { flex-direction: column; }",
                  "}",
                ],
                output: "Sur petit écran, le menu passe en colonne.",
              },
            },
            {
              heading: "Approche mobile first",
              body: ["On écrit d'abord le style mobile, puis on enrichit pour les grands écrans avec min-width."],
              code: {
                lang: "css",
                lines: [
                  ".colonnes { grid-template-columns: 1fr; }",
                  "@media (min-width: 800px) {",
                  "  .colonnes { grid-template-columns: 1fr 1fr; }",
                  "}",
                ],
              },
              tip: "max-width cible les écrans « jusqu'à », min-width les écrans « à partir de ».",
            },
          ],
          keyPoints: [
            "@media définit une condition liée à l'écran.",
            "max-width cible les écrans jusqu'à une taille donnée.",
            "min-width sert pour une approche mobile first.",
          ],
          quiz: [
            {
              q: "Quelle condition cible les petits écrans ?",
              options: ["max-width", "min-width", "width-all"],
              answer: 0,
              why: "max-width: 600px s'applique aux écrans de 600px ou moins.",
            },
            {
              q: "Quel mot-clé débute une requête média ?",
              options: ["@if", "@media", "@screen"],
              answer: 1,
              why: "@media (condition) { ... } encapsule les styles adaptatifs.",
            },
          ],
        },
      ],
    },
    {
      module: "Portfolio personnel",
      lessons: [
        {
          id: "css-grid",
          title: "CSS Grid",
          duration: "14 min",
          summary: "Créer des mises en page en deux dimensions (lignes et colonnes).",
          sections: [
            {
              heading: "Une grille simple",
              body: ["display: grid crée une grille. On définit les colonnes avec grid-template-columns."],
              code: {
                lang: "css",
                lines: [
                  ".grille {",
                  "  display: grid;",
                  "  grid-template-columns: 1fr 1fr 1fr;",
                  "  gap: 16px;",
                  "}",
                ],
              },
            },
            {
              heading: "Factoriser avec repeat",
              body: ["repeat() évite de répéter les mêmes valeurs. 1fr représente une part égale de l'espace."],
              code: {
                lang: "css",
                lines: [
                  ".grille {",
                  "  grid-template-columns: repeat(3, 1fr);",
                  "}",
                ],
              },
              tip: "1fr = une fraction de l'espace disponible : trois 1fr donnent trois colonnes égales.",
            },
          ],
          keyPoints: [
            "Grid gère à la fois les lignes et les colonnes.",
            "1fr représente une part égale de l'espace.",
            "repeat(n, x) factorise la définition des pistes.",
          ],
          quiz: [
            {
              q: "Quelle unité représente une part égale d'espace ?",
              options: ["px", "1fr", "auto"],
              answer: 1,
              why: "1fr (fraction) partage l'espace disponible.",
            },
            {
              q: "Quelle valeur de display active la grille ?",
              options: ["display: grid", "display: table", "display: flex"],
              answer: 0,
              why: "display: grid crée un conteneur en grille.",
            },
          ],
        },
        {
          id: "css-project",
          title: "Projet : une page complète",
          duration: "16 min",
          summary: "Assembler structure HTML et styles CSS pour une vraie page responsive.",
          sections: [
            {
              heading: "La structure",
              body: ["On part d'une charpente claire : en-tête, contenu principal organisé en grille, pied de page."],
              code: {
                lang: "html",
                lines: [
                  "<header> ... </header>",
                  "<main class=\"grille\">",
                  "  <article>Projet 1</article>",
                  "  <article>Projet 2</article>",
                  "</main>",
                  "<footer> ... </footer>",
                ],
              },
            },
            {
              heading: "Le style de base",
              body: ["On remet à zéro les marges du navigateur et on donne une largeur lisible au contenu."],
              code: {
                lang: "css",
                lines: [
                  "body { margin: 0; font-family: sans-serif; }",
                  "main { max-width: 1000px; margin: auto; }",
                ],
              },
              tip: "Commencez par le mobile, puis ajoutez des colonnes avec une media query pour les grands écrans.",
            },
          ],
          keyPoints: [
            "On sépare la structure (HTML) du style (CSS).",
            "Une largeur maximale centrée améliore la lisibilité.",
            "On construit mobile first, puis on enrichit en responsive.",
          ],
          quiz: [
            {
              q: "Où place-t-on le contenu principal de la page ?",
              options: ["<header>", "<main>", "<footer>"],
              answer: 1,
              why: "<main> contient le cœur de la page.",
            },
            {
              q: "Comment recentrer un bloc horizontalement ?",
              options: ["margin: auto", "align: center", "center: true"],
              answer: 0,
              why: "Avec une largeur définie, margin: auto centre horizontalement.",
            },
          ],
        },
      ],
    },
  ],
  sql: [
    {
      module: "Modèle relationnel",
      lessons: [
        {
          id: "sql-tables",
          title: "Tables et clés",
          duration: "12 min",
          summary: "Créer des tables et relier les données grâce aux clés primaire et étrangère.",
          sections: [
            {
              heading: "Créer une table",
              body: ["Une table est un ensemble de lignes et de colonnes. On la crée avec CREATE TABLE en précisant chaque colonne et son type."],
              code: {
                lang: "sql",
                lines: [
                  "CREATE TABLE etudiants (",
                  "  id INT PRIMARY KEY,",
                  "  nom VARCHAR(50),",
                  "  age INT",
                  ");",
                ],
              },
            },
            {
              heading: "Clé primaire et clé étrangère",
              body: ["La clé primaire identifie chaque ligne de façon unique. La clé étrangère relie une table à une autre."],
              code: {
                lang: "sql",
                lines: [
                  "CREATE TABLE notes (",
                  "  id INT PRIMARY KEY,",
                  "  etudiant_id INT,",
                  "  valeur INT,",
                  "  FOREIGN KEY (etudiant_id)",
                  "    REFERENCES etudiants(id)",
                  ");",
                ],
              },
              tip: "La clé étrangère garantit qu'on ne peut pas créer une note pour un étudiant inexistant.",
            },
          ],
          keyPoints: [
            "La clé primaire identifie de façon unique chaque ligne.",
            "La clé étrangère relie une table à une autre.",
            "VARCHAR(n) stocke du texte de longueur limitée.",
          ],
          quiz: [
            {
              q: "Que garantit une clé primaire ?",
              options: ["Le tri automatique", "L'unicité de chaque ligne", "La couleur"],
              answer: 1,
              why: "Chaque ligne a une clé primaire différente et unique.",
            },
            {
              q: "À quoi sert une clé étrangère ?",
              options: ["À accélérer les requêtes", "À relier une table à une autre", "À crypter les données"],
              answer: 1,
              why: "Elle référence la clé primaire d'une autre table.",
            },
          ],
        },
        {
          id: "sql-types",
          title: "Types de données et contraintes",
          duration: "11 min",
          summary: "Choisir les bons types et imposer des règles avec les contraintes.",
          sections: [
            {
              heading: "Les types courants",
              body: ["Chaque colonne a un type : INT pour les entiers, VARCHAR/TEXT pour le texte, DATE pour les dates, BOOLEAN pour les booléens."],
              code: {
                lang: "sql",
                lines: [
                  "nom VARCHAR(100),",
                  "biographie TEXT,",
                  "cree_le DATE,",
                  "actif BOOLEAN",
                ],
              },
            },
            {
              heading: "Les contraintes",
              body: ["Les contraintes imposent des règles : NOT NULL interdit le vide, UNIQUE interdit les doublons, DEFAULT donne une valeur par défaut."],
              code: {
                lang: "sql",
                lines: [
                  "email VARCHAR(120) UNIQUE NOT NULL,",
                  "role VARCHAR(20) DEFAULT 'utilisateur'",
                ],
              },
            },
          ],
          keyPoints: [
            "NOT NULL rend une colonne obligatoire.",
            "UNIQUE empêche deux fois la même valeur.",
            "DEFAULT fournit une valeur si rien n'est fourni.",
          ],
          quiz: [
            {
              q: "Quelle contrainte interdit une valeur vide ?",
              options: ["UNIQUE", "NOT NULL", "DEFAULT"],
              answer: 1,
              why: "NOT NULL exige qu'une valeur soit toujours présente.",
            },
            {
              q: "Quel type pour du texte long ?",
              options: ["INT", "TEXT", "DATE"],
              answer: 1,
              why: "TEXT est fait pour les longs textes, contrairement à VARCHAR.",
            },
          ],
        },
      ],
    },
    {
      module: "Requêtes SQL",
      lessons: [
        {
          id: "sql-select",
          title: "SELECT et WHERE",
          duration: "12 min",
          summary: "Lire et filtrer les données d'une table.",
          sections: [
            {
              heading: "Lire des données",
              body: ["SELECT choisit les colonnes à afficher. L'astérisque * signifie « toutes les colonnes »."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT nom, age FROM etudiants;",
                  "SELECT * FROM etudiants;",
                ],
              },
            },
            {
              heading: "Filtrer avec WHERE",
              body: ["La clause WHERE ne conserve que les lignes qui respectent une condition. On peut combiner plusieurs conditions avec AND et OR."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT nom FROM etudiants",
                  "WHERE age >= 18",
                  "  AND nom LIKE 'A%';",
                ],
                output: "Renvoie les étudiants majeurs dont le nom commence par A.",
              },
              tip: "LIKE 'A%' matche tout ce qui commence par A : % représente n'importe quelle suite.",
            },
          ],
          keyPoints: [
            "* sélectionne toutes les colonnes.",
            "WHERE filtre les lignes selon une condition.",
            "AND et OR combinent plusieurs conditions.",
          ],
          quiz: [
            {
              q: "Que signifie l'astérisque * dans un SELECT ?",
              options: ["Une erreur", "Toutes les colonnes", "La première ligne"],
              answer: 1,
              why: "SELECT * ramène toutes les colonnes de la table.",
            },
            {
              q: "Quelle clause filtre les lignes ?",
              options: ["WHERE", "ORDER", "FROM"],
              answer: 0,
              why: "WHERE impose une condition sur les lignes renvoyées.",
            },
          ],
        },
        {
          id: "sql-order",
          title: "Trier et limiter",
          duration: "10 min",
          summary: "Classer les résultats et n'en garder qu'une partie.",
          sections: [
            {
              heading: "Trier avec ORDER BY",
              body: ["ORDER BY classe les résultats. ASC trie en croissant (par défaut), DESC en décroissant."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT nom, age FROM etudiants",
                  "ORDER BY age DESC;",
                ],
                output: "Les étudiants du plus âgé au plus jeune.",
              },
            },
            {
              heading: "Limiter avec LIMIT",
              body: ["LIMIT plafonne le nombre de lignes renvoyées. Combinée à ORDER BY, elle crée des « top N »."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT nom FROM etudiants",
                  "ORDER BY age DESC",
                  "LIMIT 3;",
                ],
                output: "Les 3 étudiants les plus âgés.",
              },
            },
          ],
          keyPoints: [
            "ASC = croissant (par défaut), DESC = décroissant.",
            "ORDER BY classe les résultats.",
            "LIMIT restreint le nombre de lignes renvoyées.",
          ],
          quiz: [
            {
              q: "Comment trier du plus grand au plus petit ?",
              options: ["ORDER BY ... ASC", "ORDER BY ... DESC", "SORT DESC"],
              answer: 1,
              why: "DESC (descending) ordonne du plus grand au plus petit.",
            },
            {
              q: "Que fait LIMIT 5 ?",
              options: ["Efface 5 lignes", "Renvoie au plus 5 lignes", "Multiplie par 5"],
              answer: 1,
              why: "LIMIT plafonne le nombre de résultats à 5.",
            },
          ],
        },
      ],
    },
    {
      module: "Jointures et agrégats",
      lessons: [
        {
          id: "sql-join",
          title: "Les jointures (JOIN)",
          duration: "14 min",
          summary: "Combiner des données issues de plusieurs tables liées.",
          sections: [
            {
              heading: "Une jointure INNER JOIN",
              body: ["JOIN assemble les lignes de deux tables selon une condition de correspondance décrite par ON."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT etudiants.nom, notes.valeur",
                  "FROM etudiants",
                  "INNER JOIN notes",
                  "  ON etudiants.id = notes.etudiant_id;",
                ],
                output: "Chaque étudiant avec ses notes, sur une même ligne.",
              },
            },
            {
              heading: "La condition de liaison",
              body: ["ON précise quelle colonne relie les deux tables : ici, l'id de l'étudiant correspond à l'étudiant_id de la note."],
              code: {
                lang: "sql",
                lines: [
                  "ON etudiants.id = notes.etudiant_id",
                ],
              },
              tip: "INNER JOIN ne conserve que les lignes qui ont une correspondance des deux côtés.",
            },
          ],
          keyPoints: [
            "JOIN relie deux tables entre elles.",
            "ON décrit la condition de correspondance.",
            "INNER JOIN ne garde que les lignes appariées.",
          ],
          quiz: [
            {
              q: "Quel mot-clé relie deux tables ?",
              options: ["LINK", "JOIN", "MERGE"],
              answer: 1,
              why: "JOIN assemble les lignes de deux tables.",
            },
            {
              q: "Quelle clause donne la condition de liaison ?",
              options: ["WHERE", "ON", "BY"],
              answer: 1,
              why: "ON précise quelles colonnes correspondent entre les tables.",
            },
          ],
        },
        {
          id: "sql-aggregate",
          title: "Agréger les données",
          duration: "13 min",
          summary: "Calculer des statistiques (comptage, somme, moyenne) et regrouper des lignes.",
          sections: [
            {
              heading: "Compter et additionner",
              body: ["Les fonctions d'agrégat synthétisent plusieurs lignes en un seul résultat."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT COUNT(*) FROM etudiants;",
                  "SELECT SUM(valeur) FROM notes;",
                ],
                output: "Le nombre d'étudiants, puis la somme de toutes les notes.",
              },
            },
            {
              heading: "Regrouper avec GROUP BY",
              body: ["GROUP BY rassemble les lignes par catégorie avant d'appliquer la fonction d'agrégat."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT etudiant_id, AVG(valeur)",
                  "FROM notes",
                  "GROUP BY etudiant_id;",
                ],
                output: "La moyenne des notes pour chaque étudiant.",
              },
              tip: "Chaque colonne non agrégée du SELECT doit figurer dans le GROUP BY.",
            },
          ],
          keyPoints: [
            "COUNT, SUM et AVG sont des fonctions d'agrégat.",
            "GROUP BY regroupe les lignes par valeur.",
            "AVG calcule une moyenne par groupe.",
          ],
          quiz: [
            {
              q: "Quelle fonction compte les lignes ?",
              options: ["COUNT(*)", "TOTAL()", "NUMBER()"],
              answer: 0,
              why: "COUNT(*) renvoie le nombre de lignes.",
            },
            {
              q: "Quelle fonction calcule une moyenne ?",
              options: ["MEDIAN()", "AVG()", "MID()"],
              answer: 1,
              why: "AVG() retourne la moyenne des valeurs.",
            },
          ],
        },
      ],
    },
    {
      module: "Cas métier",
      lessons: [
        {
          id: "sql-modify",
          title: "INSERT, UPDATE, DELETE",
          duration: "12 min",
          summary: "Ajouter, modifier et supprimer des données dans une table.",
          sections: [
            {
              heading: "Ajouter des lignes",
              body: ["INSERT INTO crée une ou plusieurs nouvelles lignes en précisant les valeurs avec VALUES."],
              code: {
                lang: "sql",
                lines: [
                  "INSERT INTO etudiants (id, nom, age)",
                  "VALUES (1, 'Alex', 25);",
                ],
              },
            },
            {
              heading: "Modifier et supprimer",
              body: ["UPDATE change des valeurs existantes, DELETE retire des lignes. Dans les deux cas, WHERE cible les lignes concernées."],
              code: {
                lang: "sql",
                lines: [
                  "UPDATE etudiants SET age = 26 WHERE id = 1;",
                  "DELETE FROM etudiants WHERE id = 1;",
                ],
              },
              tip: "Oublier le WHERE dans un UPDATE ou un DELETE modifie TOUTES les lignes !",
            },
          ],
          keyPoints: [
            "INSERT INTO ajoute des lignes.",
            "UPDATE modifie, DELETE supprime.",
            "WHERE cible précisément les lignes à toucher.",
          ],
          quiz: [
            {
              q: "Quelle commande ajoute une ligne ?",
              options: ["ADD INTO", "INSERT INTO", "CREATE ROW"],
              answer: 1,
              why: "INSERT INTO ... VALUES (...) crée une nouvelle ligne.",
            },
            {
              q: "Quelle clause ne faut-il jamais oublier avec UPDATE ou DELETE ?",
              options: ["WHERE", "ORDER BY", "LIMIT"],
              answer: 0,
              why: "Sans WHERE, toutes les lignes seraient affectées.",
            },
          ],
        },
        {
          id: "sql-project",
          title: "Projet : modéliser une base",
          duration: "16 min",
          summary: "Concevoir une base de données cohérente pour un cas réel (clients et commandes).",
          sections: [
            {
              heading: "Identifier les entités",
              body: ["On crée une table par entité (clients, commandes) et on les relie par une clé étrangère."],
              code: {
                lang: "sql",
                lines: [
                  "CREATE TABLE clients (",
                  "  id INT PRIMARY KEY,",
                  "  nom VARCHAR(80)",
                  ");",
                  "CREATE TABLE commandes (",
                  "  id INT PRIMARY KEY,",
                  "  client_id INT,",
                  "  montant DECIMAL(10,2),",
                  "  FOREIGN KEY (client_id) REFERENCES clients(id)",
                  ");",
                ],
              },
            },
            {
              heading: "Des requêtes utiles",
              body: ["Une fois la base en place, on combine jointure et agrégat pour répondre à des questions métier."],
              code: {
                lang: "sql",
                lines: [
                  "SELECT nom, SUM(montant) AS total",
                  "FROM commandes",
                  "JOIN clients ON clients.id = commandes.client_id",
                  "GROUP BY nom;",
                ],
                output: "Le total dépensé par chaque client.",
              },
              tip: "AS renomme une colonne dans le résultat : c'est un alias, pratique pour la lisibilité.",
            },
          ],
          keyPoints: [
            "On crée une table par entité du domaine.",
            "Les clés étrangères relient les tables entre elles.",
            "Jointure + agrégat répondent à de vraies questions métier.",
          ],
          quiz: [
            {
              q: "Pourquoi normaliser une base (plusieurs tables liées) ?",
              options: ["Pour ralentir les requêtes", "Pour éviter la redondance", "Pour cacher les données"],
              answer: 1,
              why: "La normalisation évite de répéter les mêmes informations.",
            },
            {
              q: "Comment relie-t-on une commande à son client ?",
              options: ["Par une clé étrangère", "Par une couleur", "Par un ORDER BY"],
              answer: 0,
              why: "La clé étrangère client_id référence l'id du client.",
            },
          ],
        },
      ],
    },
  ],
  java: [
    {
      module: "Fondamentaux Java",
      lessons: [
        {
          id: "java-variables",
          title: "Variables et types",
          duration: "12 min",
          summary: "Déclarer des variables typées et comprendre le typage statique de Java.",
          sections: [
            {
              heading: "Un langage typé statiquement",
              body: ["En Java, on déclare le type de chaque variable. Ce type ne peut plus changer : c'est le typage statique."],
              code: {
                lang: "java",
                lines: [
                  "int age = 25;",
                  "double prix = 9.99;",
                  "boolean actif = true;",
                  "String nom = \"Alex\";",
                ],
              },
            },
            {
              heading: "Des constantes avec final",
              body: ["Le mot-clé final fige une valeur : elle ne peut plus être modifiée. Par convention, on l'écrit en majuscules."],
              code: {
                lang: "java",
                lines: [
                  "final double TVA = 0.20;",
                  "// TVA = 0.10; // erreur de compilation",
                ],
              },
              tip: "String commence par une majuscule car c'est une classe, contrairement à int ou boolean.",
            },
          ],
          keyPoints: [
            "Java est typé statiquement : le type est fixé à la déclaration.",
            "final crée une constante non modifiable.",
            "String (avec un S majuscule) représente du texte.",
          ],
          quiz: [
            {
              q: "Quel type stocke du texte en Java ?",
              options: ["string", "String", "text"],
              answer: 1,
              why: "En Java, c'est String avec une majuscule.",
            },
            {
              q: "Quel mot-clé crée une constante ?",
              options: ["const", "final", "static"],
              answer: 1,
              why: "final empêche la réassignation de la variable.",
            },
          ],
        },
        {
          id: "java-methods",
          title: "Méthodes et programme",
          duration: "13 min",
          summary: "Écrire des méthodes et comprendre le point d'entrée main d'un programme.",
          sections: [
            {
              heading: "Définir une méthode",
              body: ["Une méthode a un type de retour, un nom et des paramètres. void signifie qu'elle ne renvoie rien."],
              code: {
                lang: "java",
                lines: [
                  "static int carre(int n) {",
                  "    return n * n;",
                  "}",
                ],
              },
            },
            {
              heading: "Le point d'entrée main",
              body: ["Tout programme Java démarre dans la méthode main. C'est elle que la machine virtuelle exécute en premier."],
              code: {
                lang: "java",
                lines: [
                  "class Programme {",
                  "    public static void main(String[] args) {",
                  "        System.out.println(carre(4));",
                  "    }",
                  "}",
                ],
                output: "16",
              },
              tip: "System.out.println affiche une ligne dans la console.",
            },
          ],
          keyPoints: [
            "main est le point d'entrée de tout programme Java.",
            "return renvoie une valeur ; void n'en renvoie pas.",
            "System.out.println affiche du texte dans la console.",
          ],
          quiz: [
            {
              q: "Quelle méthode lance un programme Java ?",
              options: ["start", "main", "run"],
              answer: 1,
              why: "La machine virtuelle cherche public static void main.",
            },
            {
              q: "Comment afficher du texte dans la console ?",
              options: ["print()", "System.out.println()", "echo()"],
              answer: 1,
              why: "System.out.println écrit une ligne sur la sortie standard.",
            },
          ],
        },
        {
          id: "java-conditions",
          title: "Conditions et boucles",
          duration: "13 min",
          summary: "Prendre des décisions et répéter des instructions en Java.",
          sections: [
            {
              heading: "Les conditions",
              body: ["if/else oriente l'exécution selon une condition booléenne."],
              code: {
                lang: "java",
                lines: [
                  "int note = 14;",
                  "if (note >= 10) {",
                  "    System.out.println(\"Reçu\");",
                  "} else {",
                  "    System.out.println(\"À refaire\");",
                  "}",
                ],
                output: "Reçu",
              },
            },
            {
              heading: "La boucle for",
              body: ["La boucle for répète un bloc un nombre connu de fois, avec un compteur typé."],
              code: {
                lang: "java",
                lines: [
                  "for (int i = 0; i < 3; i++) {",
                  "    System.out.println(i);",
                  "}",
                ],
                output: "0\n1\n2",
              },
              tip: "En Java, on déclare le type du compteur : int i = 0.",
            },
          ],
          keyPoints: [
            "if/else gère les choix selon une condition.",
            "for répète un nombre déterminé de fois.",
            "Le compteur doit être typé (ex. : int i).",
          ],
          quiz: [
            {
              q: "Que produit for (int i = 0; i < 3; i++) ?",
              options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
              answer: 1,
              why: "De 0 inclus à 3 exclu : 0, 1, 2.",
            },
            {
              q: "Quel mot-clé exprime le « sinon » ?",
              options: ["elseif", "else", "otherwise"],
              answer: 1,
              why: "else introduit le bloc exécuté quand la condition est fausse.",
            },
          ],
        },
      ],
    },
    {
      module: "Objets et héritage",
      lessons: [
        {
          id: "java-objects",
          title: "Classes et objets",
          duration: "14 min",
          summary: "Créer ses propres types avec des classes et instancier des objets.",
          sections: [
            {
              heading: "Définir une classe",
              body: ["Une classe est un plan. Elle décrit des attributs (données) et des méthodes (comportements)."],
              code: {
                lang: "java",
                lines: [
                  "class Voiture {",
                  "    String couleur;",
                  "    Voiture(String c) { couleur = c; }",
                  "    void klaxonner() {",
                  "        System.out.println(\"Tut !\");",
                  "    }",
                  "}",
                ],
              },
            },
            {
              heading: "Créer un objet",
              body: ["On crée une instance avec new, ce qui appelle le constructeur pour initialiser l'objet."],
              code: {
                lang: "java",
                lines: [
                  "Voiture v = new Voiture(\"rouge\");",
                  "v.klaxonner();",
                ],
                output: "Tut !",
              },
              tip: "Le constructeur porte le même nom que la classe et prépare l'objet à l'emploi.",
            },
          ],
          keyPoints: [
            "Une classe est un modèle ; un objet est une instance de cette classe.",
            "new crée un objet et déclenche le constructeur.",
            "Les méthodes définissent le comportement de l'objet.",
          ],
          quiz: [
            {
              q: "Quel mot-clé crée une instance d'objet ?",
              options: ["create", "new", "instance"],
              answer: 1,
              why: "new Voiture(...) instancie un objet et appelle son constructeur.",
            },
            {
              q: "Que fait un constructeur ?",
              options: ["Il détruit l'objet", "Il initialise l'objet", "Il l'affiche"],
              answer: 1,
              why: "Le constructeur prépare les valeurs de l'objet lors de sa création.",
            },
          ],
        },
        {
          id: "java-inheritance",
          title: "Héritage et polymorphisme",
          duration: "14 min",
          summary: "Réutiliser du code entre classes avec extends et redéfinir des méthodes.",
          sections: [
            {
              heading: "Hériter avec extends",
              body: ["Une classe peut en étendre une autre et hériter de ses attributs et méthodes."],
              code: {
                lang: "java",
                lines: [
                  "class Vehicule {",
                  "    void rouler() {",
                  "        System.out.println(\"Vroum\");",
                  "    }",
                  "}",
                  "class Moto extends Vehicule { }",
                ],
                output: "Une Moto sait déjà rouler() : elle l'a hérité.",
              },
            },
            {
              heading: "Redéfinir une méthode",
              body: ["Une sous-classe peut redéfinir une méthode héritée pour adapter son comportement. L'annotation @Override le signale."],
              code: {
                lang: "java",
                lines: [
                  "class Moto extends Vehicule {",
                  "    @Override",
                  "    void rouler() {",
                  "        System.out.println(\"Brrr\");",
                  "    }",
                  "}",
                ],
              },
              tip: "Le polymorphisme permet d'appeler rouler() sans connaître le type exact : le bon comportement s'applique.",
            },
          ],
          keyPoints: [
            "extends permet à une classe d'en hériter d'une autre.",
            "@Override indique qu'on redéfinit une méthode héritée.",
            "Une Moto « est un » Véhicule : relation is-a.",
          ],
          quiz: [
            {
              q: "Quel mot-clé exprime l'héritage ?",
              options: ["implements", "extends", "inherits"],
              answer: 1,
              why: "class Moto extends Vehicule fait hériter Moto de Vehicule.",
            },
            {
              q: "À quoi sert @Override ?",
              options: ["À supprimer une méthode", "À redéfinir une méthode héritée", "À créer une classe"],
              answer: 1,
              why: "Il signale qu'on remplace une méthode de la classe parente.",
            },
          ],
        },
      ],
    },
    {
      module: "Collections et flux",
      lessons: [
        {
          id: "java-array",
          title: "Tableaux et List",
          duration: "14 min",
          summary: "Stocker plusieurs valeurs avec les tableaux et les ArrayList.",
          sections: [
            {
              heading: "Les tableaux",
              body: ["Un tableau regroupe un nombre fixe de valeurs du même type, accessibles par index à partir de 0."],
              code: {
                lang: "java",
                lines: [
                  "int[] notes = {12, 15, 18};",
                  "System.out.println(notes[0]);    // 12",
                  "System.out.println(notes.length);",
                ],
                output: "12\n3",
              },
            },
            {
              heading: "Les ArrayList",
              body: ["ArrayList est une liste redimensionnable : elle grandit quand on ajoute des éléments."],
              code: {
                lang: "java",
                lines: [
                  "import java.util.ArrayList;",
                  "ArrayList<String> noms = new ArrayList<>();",
                  "noms.add(\"Alex\");",
                ],
              },
              tip: "Un tableau a une taille fixe ; une ArrayList grandit dynamiquement.",
            },
          ],
          keyPoints: [
            "Les index de tableau commencent à 0.",
            ".length donne la taille d'un tableau.",
            "ArrayList est redimensionnable grâce à add().",
          ],
          quiz: [
            {
              q: "La taille d'un tableau Java est-elle fixe ou dynamique ?",
              options: ["Fixe", "Dynamique", "Infinie"],
              answer: 0,
              why: "Un tableau a une taille définie à la création.",
            },
            {
              q: "Quelle méthode ajoute un élément à une ArrayList ?",
              options: ["push()", "add()", "insert()"],
              answer: 1,
              why: "add() ajoute un élément à la fin de l'ArrayList.",
            },
          ],
        },
        {
          id: "java-exceptions",
          title: "Gérer les exceptions",
          duration: "13 min",
          summary: "Traiter les erreurs d'exécution sans interrompre brutalement le programme.",
          sections: [
            {
              heading: "try / catch",
              body: ["On encadre le code risqué par try et on récupère l'erreur dans catch selon son type."],
              code: {
                lang: "java",
                lines: [
                  "try {",
                  "    int n = Integer.parseInt(\"abc\");",
                  "} catch (NumberFormatException e) {",
                  "    System.out.println(\"Nombre invalide\");",
                  "}",
                ],
                output: "Nombre invalide",
              },
            },
            {
              heading: "Le bloc finally",
              body: ["finally s'exécute dans tous les cas, qu'une erreur se produise ou non : idéal pour libérer des ressources."],
              code: {
                lang: "java",
                lines: [
                  "finally {",
                  "    System.out.println(\"Toujours exécuté\");",
                  "}",
                ],
              },
              tip: "Catchez le type d'exception le plus précis possible, pas Exception en général.",
            },
          ],
          keyPoints: [
            "try entoure le code susceptible de planter.",
            "catch récupère et traite l'erreur.",
            "finally s'exécute toujours, erreur ou non.",
          ],
          quiz: [
            {
              q: "Où place-t-on le code risqué ?",
              options: ["Dans catch", "Dans try", "Dans finally"],
              answer: 1,
              why: "try entoure les instructions susceptibles de lever une exception.",
            },
            {
              q: "Quel bloc s'exécute dans tous les cas ?",
              options: ["try", "catch", "finally"],
              answer: 2,
              why: "finally tourne qu'il y ait exception ou non.",
            },
          ],
        },
      ],
    },
    {
      module: "Application complète",
      lessons: [
        {
          id: "java-input",
          title: "Lire des entrées clavier",
          duration: "11 min",
          summary: "Demander et lire des saisies utilisateur grâce à la classe Scanner.",
          sections: [
            {
              heading: "Créer un Scanner",
              body: ["Scanner lit l'entrée standard (le clavier). On crée un objet Scanner puis on lit des valeurs."],
              code: {
                lang: "java",
                lines: [
                  "import java.util.Scanner;",
                  "Scanner clavier = new Scanner(System.in);",
                  "System.out.print(\"Votre nom ? \");",
                  "String nom = clavier.nextLine();",
                ],
              },
            },
            {
              heading: "Lire un nombre",
              body: ["Selon la donnée attendue, on choisit la bonne méthode de lecture."],
              code: {
                lang: "java",
                lines: [
                  "int age = clavier.nextInt();",
                  "double taille = clavier.nextDouble();",
                ],
              },
              tip: "nextLine() lit du texte, nextInt() lit un entier, nextDouble() un décimal.",
            },
          ],
          keyPoints: [
            "Scanner lit l'entrée standard (System.in).",
            "nextLine() lit une ligne de texte.",
            "nextInt() lit un entier saisi.",
          ],
          quiz: [
            {
              q: "Quelle méthode lit une ligne de texte ?",
              options: ["nextText()", "nextLine()", "readLine()"],
              answer: 1,
              why: "nextLine() renvoie toute la ligne tapée.",
            },
            {
              q: "Quelle méthode lit un entier ?",
              options: ["nextInt()", "getInt()", "readNumber()"],
              answer: 0,
              why: "nextInt() parse et renvoie un int.",
            },
          ],
        },
        {
          id: "java-project",
          title: "Projet : une application",
          duration: "16 min",
          summary: "Structurer un programme Java en classes cohérentes et encapsulées.",
          sections: [
            {
              heading: "Encapsuler les données",
              body: ["On regroupe données et comportements dans une classe, en protégeant les attributs avec private."],
              code: {
                lang: "java",
                lines: [
                  "class Compte {",
                  "    private double solde;",
                  "    void deposer(double montant) { solde += montant; }",
                  "    double getSolde() { return solde; }",
                  "}",
                ],
              },
            },
            {
              heading: "Utiliser la classe",
              body: ["On instancie la classe et on interagit uniquement via ses méthodes publiques."],
              code: {
                lang: "java",
                lines: [
                  "Compte c = new Compte();",
                  "c.deposer(100);",
                  "System.out.println(c.getSolde());",
                ],
                output: "100.0",
              },
              tip: "L'encapsulation protège les données : on ne peut pas modifier solde directement.",
            },
          ],
          keyPoints: [
            "Une classe regroupe données et comportements.",
            "private protège les attributs de l'extérieur.",
            "Un accesseur (getter) comme getSolde() lit une valeur protégée.",
          ],
          quiz: [
            {
              q: "Comment protéger un attribut de l'extérieur ?",
              options: ["public", "private", "open"],
              answer: 1,
              why: "private limite l'accès à la seule classe.",
            },
            {
              q: "Comment lire un attribut privé depuis l'extérieur ?",
              options: ["Directement", "Via un accesseur (getter)", "Impossible"],
              answer: 1,
              why: "Un getter comme getSolde() expose la valeur en lecture.",
            },
          ],
        },
      ],
    },
  ],
  c: [
    {
      module: "Compiler en C",
      lessons: [
        {
          id: "c-anatomy",
          title: "Anatomie d'un programme",
          duration: "12 min",
          summary: "Découvrir la structure d'un programme C et comment le compiler.",
          sections: [
            {
              heading: "Le point d'entrée main",
              body: ["Tout programme C possède une fonction main : c'est là que l'exécution commence. Elle renvoie un entier (0 = succès)."],
              code: {
                lang: "c",
                lines: [
                  "#include <stdio.h>",
                  "",
                  "int main(void) {",
                  "    printf(\"Bonjour\\n\");",
                  "    return 0;",
                  "}",
                ],
                output: "Bonjour",
              },
            },
            {
              heading: "Compiler et exécuter",
              body: ["Le code source (.c) doit être compilé en exécutable. Avec GCC, on obtient un fichier qu'on lance ensuite."],
              code: {
                lang: "bash",
                lines: [
                  "gcc programme.c -o programme",
                  "./programme",
                ],
                output: "Le compilateur produit l'exécutable « programme ».",
              },
              tip: "printf vient de la bibliothèque stdio.h, d'où le #include en haut.",
            },
          ],
          keyPoints: [
            "main est le point d'entrée et renvoie un int.",
            "#include <stdio.h> fournit printf pour afficher du texte.",
            "return 0 signale une exécution réussie.",
          ],
          quiz: [
            {
              q: "Quelle bibliothèque fournit printf ?",
              options: ["stdlib.h", "stdio.h", "math.h"],
              answer: 1,
              why: "printf est déclarée dans stdio.h (standard input/output).",
            },
            {
              q: "Quel est le type de retour de main ?",
              options: ["void", "int", "char"],
              answer: 1,
              why: "main renvoie un int, généralement 0 pour indiquer le succès.",
            },
          ],
        },
        {
          id: "c-io",
          title: "Variables et entrées/sorties",
          duration: "13 min",
          summary: "Stocker des valeurs et lire une saisie utilisateur avec scanf.",
          sections: [
            {
              heading: "Les types de base",
              body: ["Le C est typé statiquement. int pour les entiers, float pour les décimaux, char pour un caractère."],
              code: {
                lang: "c",
                lines: [
                  "int age = 25;",
                  "float taille = 1.78f;",
                  "char initiale = 'A';",
                ],
              },
            },
            {
              heading: "Lire avec scanf",
              body: ["scanf lit une valeur saisie. On lui passe le format (%d pour un int) et l'adresse de la variable grâce à l'opérateur &."],
              code: {
                lang: "c",
                lines: [
                  "int n;",
                  "printf(\"Votre âge ? \");",
                  "scanf(\"%d\", &n);",
                  "printf(\"Vous avez %d ans\\n\", n);",
                ],
                output: "Lit l'entier tapé puis l'affiche.",
              },
              tip: "%d = entier, %f = flottant, %c = caractère.",
            },
          ],
          keyPoints: [
            "L'opérateur & donne l'adresse d'une variable, indispensable pour scanf.",
            "%d formate un int, %f un float.",
            "printf affiche, scanf lit depuis la console.",
          ],
          quiz: [
            {
              q: "Quel spécificateur formate un entier dans printf ?",
              options: ["%d", "%s", "%f"],
              answer: 0,
              why: "%d (decimal) s'utilise pour les int.",
            },
            {
              q: "Pourquoi met-on & dans scanf(\"%d\", &n) ?",
              options: ["Pour multiplier", "Pour passer l'adresse de n", "C'est décoratif"],
              answer: 1,
              why: "scanf a besoin de l'adresse mémoire pour y écrire la valeur.",
            },
          ],
        },
        {
          id: "c-conditions",
          title: "Conditions et boucles",
          duration: "12 min",
          summary: "Tester des conditions et répéter des instructions en C.",
          sections: [
            {
              heading: "Les conditions",
              body: ["if/else oriente le programme selon une condition. Attention : == teste l'égalité, = affecte une valeur."],
              code: {
                lang: "c",
                lines: [
                  "int age = 20;",
                  "if (age >= 18) {",
                  "    printf(\"Majeur\\n\");",
                  "} else {",
                  "    printf(\"Mineur\\n\");",
                  "}",
                ],
                output: "Majeur",
              },
            },
            {
              heading: "La boucle for",
              body: ["La boucle for répète un bloc avec un compteur, comme dans la plupart des langages."],
              code: {
                lang: "c",
                lines: [
                  "for (int i = 0; i < 3; i++) {",
                  "    printf(\"%d\\n\", i);",
                  "}",
                ],
                output: "0\n1\n2",
              },
              tip: "Confondre = (affectation) et == (comparaison) est l'erreur la plus classique en C.",
            },
          ],
          keyPoints: [
            "if/else gère les choix selon une condition.",
            "for répète un bloc un nombre déterminé de fois.",
            "== compare, = affecte.",
          ],
          quiz: [
            {
              q: "Quel opérateur teste l'égalité en C ?",
              options: ["=", "==", "==="],
              answer: 1,
              why: "== compare deux valeurs ; = affecte.",
            },
            {
              q: "Que produit for (int i = 0; i < 3; i++) ?",
              options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
              answer: 1,
              why: "De 0 inclus à 3 exclu : 0, 1, 2.",
            },
          ],
        },
      ],
    },
    {
      module: "Mémoire et pointeurs",
      lessons: [
        {
          id: "c-pointers",
          title: "Les pointeurs",
          duration: "15 min",
          summary: "Comprendre adresses mémoire, pointeurs et déréférencement.",
          sections: [
            {
              heading: "Une variable a une adresse",
              body: ["Chaque variable est stockée à une adresse en mémoire. L'opérateur & récupère cette adresse, et un pointeur la stocke."],
              code: {
                lang: "c",
                lines: [
                  "int x = 10;",
                  "int *p = &x;   // p pointe vers x",
                  "printf(\"%d\\n\", *p);   // 10",
                ],
                output: "10",
              },
            },
            {
              heading: "Déréférencer un pointeur",
              body: ["L'opérateur * accède à la valeur pointée. En écrivant *p, on lit ou modifie directement la variable d'origine."],
              code: {
                lang: "c",
                lines: [
                  "*p = 20;",
                  "printf(\"%d\\n\", x);    // 20",
                ],
                output: "20",
              },
              tip: "& donne l'adresse, * donne la valeur à cette adresse. Ce sont les deux faces d'un même mécanisme.",
            },
          ],
          keyPoints: [
            "& renvoie l'adresse d'une variable.",
            "* accède à la valeur située à l'adresse pointée.",
            "Un pointeur est une variable qui contient une adresse mémoire.",
          ],
          quiz: [
            {
              q: "Quel opérateur donne l'adresse d'une variable ?",
              options: ["*", "&", "#"],
              answer: 1,
              why: "&x renvoie l'adresse en mémoire de x.",
            },
            {
              q: "Que renvoie *p si p pointe vers x valant 10 ?",
              options: ["L'adresse de p", "La valeur 10", "0"],
              answer: 1,
              why: "* déréférence : il renvoie la valeur pointée, soit 10.",
            },
          ],
        },
        {
          id: "c-memory",
          title: "Allocation mémoire",
          duration: "15 min",
          summary: "Allouer de la mémoire dynamiquement avec malloc et la libérer avec free.",
          sections: [
            {
              heading: "Allouer avec malloc",
              body: ["malloc réserve un bloc de mémoire sur le tas (heap). On utilise sizeof pour demander la bonne taille pour chaque élément."],
              code: {
                lang: "c",
                lines: [
                  "int *tab = malloc(3 * sizeof(int));",
                  "tab[0] = 5;",
                  "tab[1] = 10;",
                  "tab[2] = 15;",
                ],
              },
            },
            {
              heading: "Libérer avec free",
              body: ["La mémoire allouée manuellement doit être rendue avec free, sinon on crée des fuites de mémoire."],
              code: {
                lang: "c",
                lines: [
                  "free(tab);",
                  "tab = NULL;",
                ],
                output: "La mémoire est rendue au système.",
              },
              tip: "À chaque malloc doit correspondre un free : c'est la règle d'or en C.",
            },
          ],
          keyPoints: [
            "malloc alloue de la mémoire dynamiquement sur le tas.",
            "sizeof donne la taille en octets d'un type.",
            "free libère la mémoire et évite les fuites.",
          ],
          quiz: [
            {
              q: "Quelle fonction libère la mémoire allouée ?",
              options: ["delete", "free", "release"],
              answer: 1,
              why: "free(ptr) rend au système la mémoire allouée par malloc.",
            },
            {
              q: "Que renvoie malloc ?",
              options: ["Un pointeur vers le bloc alloué", "La taille", "Un entier"],
              answer: 0,
              why: "malloc renvoie l'adresse du début du bloc de mémoire réservé.",
            },
          ],
        },
      ],
    },
    {
      module: "Structures de données",
      lessons: [
        {
          id: "c-array",
          title: "Les tableaux",
          duration: "12 min",
          summary: "Stocker une suite de valeurs du même type et les parcourir.",
          sections: [
            {
              heading: "Déclarer un tableau",
              body: ["Un tableau regroupe plusieurs valeurs du même type, accessibles par un index commençant à 0."],
              code: {
                lang: "c",
                lines: [
                  "int notes[3] = {12, 15, 18};",
                  "printf(\"%d\\n\", notes[0]);   // 12",
                ],
                output: "12",
              },
            },
            {
              heading: "Parcourir un tableau",
              body: ["On utilise une boucle for pour visiter chaque case, de l'index 0 jusqu'à la taille du tableau."],
              code: {
                lang: "c",
                lines: [
                  "for (int i = 0; i < 3; i++) {",
                  "    printf(\"%d\\n\", notes[i]);",
                  "}",
                ],
                output: "12\n15\n18",
              },
              tip: "En C, un tableau ne connaît pas sa propre taille : gardez-la dans une variable à part.",
            },
          ],
          keyPoints: [
            "Les index commencent à 0.",
            "La taille d'un tableau est fixée à la déclaration.",
            "On parcourt un tableau avec une boucle for.",
          ],
          quiz: [
            {
              q: "Quel est l'index du premier élément d'un tableau C ?",
              options: ["1", "0", "-1"],
              answer: 1,
              why: "Comme partout, on commence à 0.",
            },
            {
              q: "La taille d'un tableau en C est...",
              options: ["dynamique", "fixe à la déclaration", "inconnue"],
              answer: 1,
              why: "On la fixe en créant le tableau, ex. : int notes[3].",
            },
          ],
        },
        {
          id: "c-struct",
          title: "Les structures (struct)",
          duration: "13 min",
          summary: "Regrouper des données de types différents au sein d'une même structure.",
          sections: [
            {
              heading: "Définir une structure",
              body: ["Une struct regroupe plusieurs champs, chacun avec son propre type, sous un même nom."],
              code: {
                lang: "c",
                lines: [
                  "struct Point {",
                  "    int x;",
                  "    int y;",
                  "};",
                ],
              },
            },
            {
              heading: "Utiliser une structure",
              body: ["On crée une variable du type de la structure, puis on accède à ses champs avec le point."],
              code: {
                lang: "c",
                lines: [
                  "struct Point p;",
                  "p.x = 10;",
                  "p.y = 20;",
                  "printf(\"%d, %d\\n\", p.x, p.y);",
                ],
                output: "10, 20",
              },
              tip: "Le point . permet d'accéder à un champ : p.x désigne le champ x de p.",
            },
          ],
          keyPoints: [
            "Une struct regroupe plusieurs champs de types variés.",
            "On accède à un champ avec l'opérateur point (.).",
            "Chaque champ conserve son propre type.",
          ],
          quiz: [
            {
              q: "Quel opérateur accède à un champ de structure ?",
              options: ["->", ".", ":"],
              answer: 1,
              why: "p.x accède au champ x de la structure p.",
            },
            {
              q: "Quelle construction regroupe des données de types différents ?",
              options: ["Un tableau", "Une struct", "Un pointeur"],
              answer: 1,
              why: "Une struct mélange librement int, char, etc.",
            },
          ],
        },
      ],
    },
    {
      module: "Projet système",
      lessons: [
        {
          id: "c-functions",
          title: "Découper en fonctions",
          duration: "12 min",
          summary: "Organiser un programme C en fonctions courtes et réutilisables.",
          sections: [
            {
              heading: "Déclarer une fonction",
              body: ["Une fonction a un type de retour, un nom et des paramètres. Elle effectue un traitement et peut renvoyer un résultat."],
              code: {
                lang: "c",
                lines: [
                  "int addition(int a, int b) {",
                  "    return a + b;",
                  "}",
                ],
              },
            },
            {
              heading: "Appeler une fonction",
              body: ["On appelle la fonction en lui passant des arguments ; elle renvoie son résultat."],
              code: {
                lang: "c",
                lines: [
                  "int resultat = addition(3, 4);",
                  "printf(\"%d\\n\", resultat);",
                ],
                output: "7",
              },
              tip: "On place souvent les prototypes (déclarations) en haut du fichier et les définitions plus bas.",
            },
          ],
          keyPoints: [
            "Une fonction possède un type de retour.",
            "return renvoie la valeur à l'appelant.",
            "Les paramètres transmettent les données à la fonction.",
          ],
          quiz: [
            {
              q: "Quel mot-clé renvoie une valeur depuis une fonction C ?",
              options: ["return", "give", "yield"],
              answer: 0,
              why: "return transmet le résultat et termine la fonction.",
            },
            {
              q: "Quel est le type de retour de addition(int, int) ?",
              options: ["void", "int", "float"],
              answer: 1,
              why: "Elle renvoie la somme de deux int, donc un int.",
            },
          ],
        },
        {
          id: "c-project",
          title: "Compiler plusieurs fichiers",
          duration: "14 min",
          summary: "Répartir son code dans plusieurs fichiers .c et .h pour mieux l'organiser.",
          sections: [
            {
              heading: "Un fichier d'en-tête",
              body: ["Le fichier .h contient les déclarations (prototypes) que d'autres fichiers pourront utiliser."],
              code: {
                lang: "c",
                lines: [
                  "// outils.h",
                  "int addition(int a, int b);",
                ],
              },
            },
            {
              heading: "Tout compiler ensemble",
              body: ["On fournit tous les fichiers .c au compilateur, qui les assemble en un seul exécutable."],
              code: {
                lang: "bash",
                lines: [
                  "gcc main.c outils.c -o programme",
                ],
                output: "Produit l'exécutable « programme » à partir des deux sources.",
              },
              tip: "Le .h déclare, le .c définit : on sépare l'interface de l'implémentation.",
            },
          ],
          keyPoints: [
            "Le .h contient les déclarations (prototypes).",
            "Le .c contient les définitions du code.",
            "On compile tous les fichiers .c en une seule commande.",
          ],
          quiz: [
            {
              q: "Quelle extension pour un fichier d'en-tête en C ?",
              options: [".c", ".h", ".cpp"],
              answer: 1,
              why: "Les en-têtes portent l'extension .h (header).",
            },
            {
              q: "Comment compiler main.c et outils.c ensemble ?",
              options: ["gcc main.c outils.c -o programme", "compile main outils", "build main+outils"],
              answer: 0,
              why: "On liste tous les fichiers sources puis -o pour nommer l'exécutable.",
            },
          ],
        },
      ],
    },
  ],
};

/** Construit l'identifiant complet d'une leçon (cours + leçon). */
export function fullLessonId(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

/** Aplatit toutes les leçons d'un cours pour la navigation. */
export function flattenLessons(courseId: string) {
  const modules = lessonCatalog[courseId] ?? [];
  const flat: { lessonId: string; module: string; lesson: Lesson }[] = [];
  for (const group of modules) {
    for (const lesson of group.lessons) {
      flat.push({ lessonId: lesson.id, module: group.module, lesson });
    }
  }
  return flat;
}

/** Nombre total de leçons d'un cours. */
export function lessonCount(courseId: string) {
  return flattenLessons(courseId).length;
}
