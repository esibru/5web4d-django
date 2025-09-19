---
title: Mon premier modèle
description: Docs intro
---

## Mon premier modèle

Nous allons maintenant définir les modèles – essentiellement, le schéma de base de données, avec quelques métadonnées supplémentaires.

> *_Philosophie de Django_*
> Un modèle est la source d’information unique et définitive pour vos données. Il contient les champs essentiels et le comportement attendu des données que vous stockerez. Django respecte la philosophie DRY (**Don’t Repeat Yourself**, « ne vous répétez pas »). Le but est de définir le modèle des données à un seul endroit, et ensuite de dériver automatiquement ce qui est nécessaire à partir de celui-ci.
>
>Ceci inclut les migrations. En effet, les migrations sont entièrement dérivées du fichier des modèles et ne sont au fond qu’un historique que Django peut parcourir pour mettre à jour le schéma de la base de données pour qu’il corresponde aux modèles actuels.


### Migration et base de données

Lorsqu'on exécute la commande `python manage.py migrate`, cela provoque une migration du modèle. Nous n'avons pas encore défini de modèle, mais certains éléments existent déjà !
Ainsi, après avoir saisi la commande donnée, un fichier `db.sqlite3` apparaît.

Par défaut, Django utilise une base de donnée _SQLite_. Cela peut facilement être changé en modifiant le fichier `settings`. C'est ce que nous ferons un peu plus tard. Voici la configuration actuelle :

``` python showLineNumbers=false title="mproject/settings.py"
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

> *_Parenthèse Python 🐍_*
> 
> `DATABASES` est initialisé avec un dictionnaire. Dans ce dictionnaire, il n'y a qu'un seul élément dont la clé est 'default" et la valeur est un autre dictionnaire.
> La valeur de `default` est donc un dictionnaire contenant deux valeurs.
> Notons ici que `BASE_DIR` est un objet de type `path`. L'opérateur `/` permet de concaténer un chemin.

> *_Exercices Python 🐍 ⭐️_*
>
> Quelles sont les résultats cachés par des points d'interrogation des instructions suivantes ?
>
> ``` python showLineNumbers=false frame="none"
> >>> trigrammes = {'jlc': 'Jonathan Lechien', 'sdr': 'Sébastien Drobisz'}
> >>> trigrammes['jlc']
> ❓
> # On peut mettre d'autres types comme clé-valeur. On peut même varier dans un même dictionnaire.
> >>> mon_dico = {3: 'trois', 'trois': 3}
> >>> mon_dico[3]
> ❓
> >>> mon_dico['trois'] 
> ❓
> ```

#### Développons notre premier modèle

Nous allons maintenant développer notre premier modèle. Dans le fichier `developer/models.py`, copiez le contenu ci-dessous.

``` python showLineNumbers=true title="developer/models.py"
from django.db import models

class Developer(models.Model):
    first_name = models.CharField("first name", max_length=200)
    last_name = models.CharField(max_length=200)

class Task(models.Model):
    title = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    assignee = models.ForeignKey(Developer, related_name="tasks", on_delete=models.CASCADE, null=True, verbose_name="assignee")
```

* Ici, chaque modèle est représenté par une classe qui hérite de `django.db.models.Model`. Chaque modèle possède des variables de classe, chacune d’entre elles représentant un champ de la base de données pour ce modèle. (🐍 En python, l'héritage se fait en mettant le modèle parent entre parenthèse. En ☕️java, il se fait avec le mot clé `extends`.)
* Chaque champ est représenté par une instance d’une classe `Field` – par exemple, `CharField` pour les champs de type caractère, et `DateTimeField` pour les champs date et heure. Cela indique à Django le type de données que contient chaque champ.
* Le nom de chaque instance de `Field` (par exemple, `first_name` ou `title`) est le nom du champ en interne. Vous l’utiliserez dans votre code Python et votre base de données l’utilisera comme nom de colonne.
* Vous pouvez utiliser le premier paramètre de position (facultatif) d’un `Field`  pour donner un nom plus lisible au champ. C’est utilisé par le système d’introspection de Django, et aussi pour la documentation. Si ce paramètre est absent, Django utilisera le nom du champ interne. Dans l’exemple, nous n’avons défini qu’un seul nom, pour `first_name` (en réalité, le nom donné automatiquement par Django est le même... 🙄). Parfois, le premier champ est pris par un autre paramètre. Dans ce cas, il est malgré tout possible d'assigner une valeur grâce à `verbose_name`(voir `assignee`).
* Certaines classes `Field` possèdent des paramètres obligatoires. La classe `CharField`, par exemple, a besoin d’un attribut `max_length`. Ce n’est pas seulement utilisé dans le schéma de base de la base de données, mais également pour valider les champs, comme nous allons voir prochainement.
* Finalement, notez que nous définissons une association, en utilisant `ForeignKey` (plusieurs-à-un). Cela indique à Django que chaque tâche (Task) n’est reliée qu’à un seul développeur. Django propose tous les modèles classiques d'association : 
  * plusieurs-à-un,
  * plusieurs-à-plusieurs,
  * un-à-un.

Pour plus d'information sur les champs : 

* [Options des champs](https://docs.djangoproject.com/fr/4.1/ref/models/fields/) 📖 ;
* [Type des champs](https://docs.djangoproject.com/fr/4.1/ref/models/fields/#field-types) 📖 ;
* [plusieurs-à-plusieurs](https://docs.djangoproject.com/fr/4.1/topics/db/examples/many_to_many/) 📖 ;
* [plusieurs-à-un](https://docs.djangoproject.com/fr/4.1/topics/db/examples/many_to_one/) 📖 ;
* [un-à-un](https://docs.djangoproject.com/fr/4.1/topics/db/examples/one_to_one/) 📖.

#### Activation du modèle et migrations

Ce petit morceau de code décrivant les modèles fournit beaucoup d’informations à Django. Cela lui permet de :
* créer un schéma de base de données (instructions `CREATE TABLE`) pour cette application.
* Créer une API Python d’accès aux bases de données pour accéder aux objets `Developer` et `Task`.

Essayons de migrer les changements 🐇. La migration se fait grâce à la commande 
``` sh showLineNumbers=false frame="none"
$ python manage.py makemigrations
```

Résultat :

``` sh showLineNumbers=false frame="none"
No changes detected
```

Rien ne s'est passé, en réalité, il faut d'abord "installer" l'application developer.

##### Installation de l'application `developer`

Pour inclure l’application dans notre projet, nous avons besoin d’ajouter une référence à sa classe de configuration dans le réglage `INSTALLED_APPS` présent dans le fichier `settings.py`. La classe `DeveloperConfig` se trouve dans le fichier `developer/apps.py`, ce qui signifie que son chemin pointé est `developer.apps.DeveloperConfig`. Modifiez le fichier `mproject/settings.py` et ajoutez ce chemin pointé au réglage `INSTALLED_APPS`. Il doit ressembler à ceci :

``` python showLineNumbers=false frame="none" ins={9, 10} title="mproject/settings.py"
  INSTALLED_APPS = [
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
  
  # My apps
      'developer.apps.DeveloperConfig', 
```

##### Commande `makemigrations`

Maintenant que c'est fait, nous pouvons relancer la commande `python manage.py makemigrations`.

Vous devriez avoir quelque chose de similaire à ceci :

``` showLineNumbers=false frame="none" 
Migrations for 'developer':
  developer\migrations\0001_initial.py
    - Create model Developer
    - Create model Task
```

En exécutant `makemigrations`, vous indiquez à Django que vous avez effectué des changements à vos modèles (dans le cas présent, vous  avez créé un nouveau modèle) et que vous aimeriez que ces changements soient stockés sous forme de migration.

Les migrations sont le moyen utilisé par Django pour stocker les modifications de vos modèles (et donc de votre schéma de base de données), il s’agit de fichiers présent sur votre disque. Vous pouvez consultez la migration pour vos nouveaux modèles si vous le voulez ; il s’agit du fichier `developer/migrations/0001_initial.py` ⭐️. Soyez sans crainte, vous n’êtes pas censé les lire chaque fois que Django en créé, mais ils sont conçus pour être lisibles facilement par un humain au cas où vous auriez besoin d’adapter manuellement les processus de modification de Django.

##### Commande `sqlmigrate`

Il existe une commande qui exécute les migrations et gère automatiquement votre schéma de base de données, elle s’appelle `migrate`. Nous y viendrons bientôt, mais tout d’abord, voyons les instructions SQL que la migration produit. La commande `sqlmigrate` accepte des noms de migrations et affiche le code SQL correspondant :

``` sh showLineNumbers=false frame="none"
$ python manage.py sqlmigrate developer 0001
``` 

Vous devriez voir quelque chose de similaire à ceci (remis en forme par souci de lisibilité) :

``` sql showLineNumbers=false frame="none"
BEGIN;
--
-- Create model Developer
--
CREATE TABLE "developer_developer" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" varchar(200) NOT NULL,
    "last_name" varchar(200) NOT NULL);
--
-- Create model Task
--
CREATE TABLE "developer_task" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" varchar(100) NOT NULL UNIQUE,
    "description" text NOT NULL,
    "assignee_id" integer NOT NULL
        REFERENCES "developer_developer" ("id")
        DEFERRABLE INITIALLY DEFERRED);

CREATE INDEX "developer_task_assignee_id_497c1e11"
    ON "developer_task" ("assignee_id");

COMMIT;
```

Notez les points suivants :

* Ce que vous verrez dépendra de la base de données que vous utilisez. L’exemple ci-dessus est généré pour SQLite.
* Les noms de tables sont générés automatiquement en combinant le nom de l’application (`developer`) et le nom du modèle en minuscules – `developer` et `task` (Les [meta-options du modèle](https://docs.djangoproject.com/en/4.1/ref/models/options/#db-table) permettent de changer ce comportement).
* Des clés primaires (ID) sont ajoutées automatiquement ([un autre champ peut-être défini comme clé primaire avec l'option `primary_key=True`](https://docs.djangoproject.com/en/4.1/topics/db/models/#field-options)).
* Par convention, Django ajoute `_id` au nom de champ de la clé étrangère (et oui, vous pouvez aussi changer ça).
* La relation de clé étrangère est rendue explicite par une contrainte `FOREIGN KEY`.
* Ce que vous voyez est adapté à la base de données que vous utilisez. Ainsi, des champs spécifiques à celle-ci comme `auto_increment` (MySQL), `serial` (PostgreSQL) ou `integer primary key autoincrement` (SQLite) sont gérés pour vous automatiquement. Tout comme pour les guillemets autour des noms de champs (simples ou doubles).
* La ⚠️**commande sqlmigrate n’exécute pas réellement la migration** dans votre base de données - elle se contente de l’afficher à l’écran de façon à vous permettre de voir le code SQL que Django pense nécessaire. C’est utile pour savoir ce que Django s’apprête à faire ou si vous avez des administrateurs de base de données qui exigent des scripts SQL pour faire les modifications.


⭐️ Si vous vérifiez la base de donnée, vous ne verrez aucun changement. En effet, vous n'avez pas encore appliqué la migration.

##### Commande migrate

Appliquons maintenant notre migration. Saisissez la commande :

``` sh showLineNumbers=false frame="none"
$ python manage.py migrate
```

La commande migrate sélectionne toutes les migrations qui n’ont pas été appliquées (Django garde la trace des migrations appliquées en utilisant une table spéciale dans la base de données : django_migrations) puis les exécute dans la base de données, ce qui consiste essentiellement à synchroniser les changements des modèles avec le schéma de la base de données.

⭐️ Vérifiez à nouveau la base de donnée. Quelle(s) table(s) a(ont) été ajoutée(s) ?

##### Résumé des commandes makemigrations et migrate

Les migrations sont très puissantes et permettent de gérer les changements de modèles dans le temps, au cours du développement d’un projet, sans devoir supprimer la base de données ou ses tables et en refaire de nouvelles. Une migration s’attache à mettre à jour la base de données en live, sans perte de données. Nous les aborderons plus en détails dans une partie ultérieure de ce didacticiel, mais pour l’instant, retenez le guide en trois étapes pour effectuer des modifications aux modèles :

> 1. Modifiez les modèles (dans `models.py`).
> 1. Exécutez `python manage.py makemigrations` pour créer des migrations correspondant à ces changements.
> 1. Exécutez `python manage.py migrate` pour appliquer ces modifications à la base de données.

La raison de séparer les commandes pour créer et appliquer les migrations est que celles-ci vont être ajoutées dans votre système de gestion de versions et qu’elles seront livrées avec l’application ; elles ne font pas que faciliter le développement, elles sont également exploitables par d’autres développeurs ou en production.

### Pensez à utiliser un gestionnaire de versions

Cela pourrait être utile pour vous de revenir en arrière dans ce tutoriel et dans votre code. Pensez donc à versionner votre code aussi souvent que vous le jugerez nécessaire.

### Interface de programmation (API)

Maintenant, utilisons un shell interactif Python pour jouer avec l’API que Django met à votre disposition. Pour lancer un shell Python, utilisez cette commande :

``` sh showLineNumbers=false frame="none"
$ python manage.py shell
```

Nous utilisons celle-ci au lieu de simplement taper « python », parce que `manage.py` définit la variable d’environnement `DJANGO_SETTINGS_MODULE`, qui indique à Django le chemin d’importation Python vers votre fichier `developer/settings.py`. 

📃 Notez que cette API est utilisée plus loin pour la manipulation des modèles. La maîtrise de celle-ci est donc essentiel pour le développement d'application Web avec Django ! ⚠️

Une fois dans le shell, explorez [l'api de base de donnée](https://docs.djangoproject.com/fr/4.1/topics/db/queries/) 📖.

``` python showLineNumbers=false frame="none"
>>> from developer.models import Developer, Task
>>> Developer.objects.all()
<QuerySet []>
```

On obtient un _QuerySet_ en utilisant le _Manager_ du modèle. Chaque modèle a au moins un Manager ; il s’appelle _objects_ par défaut.

* [QuerySet](https://docs.djangoproject.com/fr/4.1/ref/models/querysets/#django.db.models.query.QuerySet) 📖
* [Manager](https://docs.djangoproject.com/fr/4.1/topics/db/managers/#django.db.models.Manager) 📖

Ici, le QuerySet est vide puisqu'aucun élément n'a été créé.

``` python showLineNumbers=false frame="none"
>>> jlc = Developer(first_name='Jonahtan', last_name='Lechien')
```

Nous venons de créer un nouveau développeur. Vérifiez que celui-ci a bien été créé dans la base de donnée ! 🐇⭐️

Vous vous êtes peut-être fait avoir. Quoiqu'il en soit, vous avez pu vérifier qu'il n'y a aucun nouvel enregistrement. Il est nécessaire de le sauvegarder pour que celui-ci soit enregistré en base de donnée...

``` python showLineNumbers=false frame="none"
>>> jlc.save()
```

Il est possible de créer un nouvel enregistrement en passant par un manager, il n'est alors pas nécessaire de le sauvegarder. Essayez ! ⭐️

``` python showLineNumbers=false frame="none"
>>> sdr = Developer.objects.create(first_name='Sébastien', last_name='Drobisz')
```

Continuons d'explorer

``` python showLineNumbers=false frame="none"
>>> jlc.id
1
>>> jlc.first_name
'Jonahtan'
>>> jlc.last_name
'Lechien'
>>> jlc.first_name = 'Jonathan' 
>>> jlc.save()
>>> Developer.objects.all()
<QuerySet [<Developer: Developer object (1)>, <Developer: Developer object (2)>]>
```

Une seconde. `<Developer: Developer object (1)>` n’est pas une représentation très utile de cet objet. On va arranger cela en éditant le modèle `Developer` (dans le fichier developer/models.py) et en ajoutant une méthode `__str__()` à `Developer` et à `Task`:

``` python showLineNumbers=true frame="none" ins={5,6, 13, 14}
  class Developer(models.Model):
      first_name = models.CharField("first name", max_length=200)
      last_name = models.CharField(max_length=200)
  
      def __str__(self):
          return f"{self.first_name} {self.last_name}"
  
  class Task(models.Model):
      title = models.CharField(max_length=100, unique=True)
      description = models.TextField()
      assignee = models.ForeignKey(Developer, related_name="tasks", on_delete=models.CASCADE, null=True, verbose_name="assignee")
  
      def __str__(self):
          return f"{self.title} ({self.description})"
```

> *_Parenthèse python 🐍_*
> 
> * Vous l'aurez probablement compris, `__str__()` est à Python 🐍 ce que `toString()` est à Java ☕️.
> * Pour formater du texte, on peut utiliser : 
>   * `'%s %s' % (self.first_name, self.last_name)` 💩 ;
>   * `'{} {}'.format(self.first_name, self.last_name)` 💩 ;
>   * `f"{self.first_name} {self.last_name}" ` (👍 depuis python 3.6).

Vous pouvez **relancer** le shell maintenant.

``` python showLineNumbers=false frame="none"
>>> Developer.objects.all()
<QuerySet [<Developer: Jonahtan Lechien>, <Developer: Sébastien Drobisz>]>
```

Continuons sur notre lancée

``` python  showLineNumbers=false frame="none"
>>> Developer.objects.filter(id=1)
<QuerySet [<Developer: Jonahtan Lechien>]>
>>> Developer.objects.filter(first_name__startswith='S')
<QuerySet [<Developer: Sébastien Drobisz>]>
>>> Developer.objects.get(pk=1)
<Developer: Jonahtan Lechien>
>>> faire_cours_django = Task.objects.create(title='cours django', description='Faire le cours de django (avec un peu de python)')
>>> faire_cours_django.assignee = sdr 
>>> faire_cours_django.save()
>>> jlc.tasks.create(title='cours Odoo', description='Faire le cours sur Odoo')
```

Si vous avez lu le tuto [ici](https://docs.djangoproject.com/fr/4.1/intro/tutorial02/) vous avez pu remarquer que nous utilisons `tasks` plutôt que `task_set`. Cela nous est possible puisque nous avons défini le paramètre `relative_name` dans notre modèle `Task`.

``` python  showLineNumbers=false frame="none"
>>> jlc.tasks.all()   
<QuerySet [<Task: cours Odoo (Faire le cours sur Odoo)>]>
>>> jlc_task = jlc.tasks.all()[0] 
>>> jlc_task.title
'cours Odoo'
>>> jlc.tasks.count()
1
>>> jlc_task.delete()
(1, {'developer.Task': 1})
>>> jlc.tasks.count() 
0
```

##### Toujours plus d'information 📖 :

* [Recherche dans les champs](https://docs.djangoproject.com/fr/4.1/topics/db/queries/#field-lookups-intro).
* [Référence des objets liés](https://docs.djangoproject.com/fr/4.1/ref/models/relations/).
