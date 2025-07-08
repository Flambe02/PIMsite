# Version OCR-issue : Parsing hybride OCR pour bulletins de paie

## Résumé
Cette version introduit une stratégie de parsing robuste et hybride pour l'API `/api/process-payslip`.

- **Source principale** : le texte brut complet (`document.text`) issu de Google Document AI.
- **Extraction par regex** : chaque champ clé (nom employé, employeur, salaire, INSS, IRRF, etc.) est d'abord extrait par expressions régulières personnalisées.
- **Fallback IA** : si la regex échoue, on utilise la valeur correspondante trouvée dans les entités structurées de Document AI (`document.entities`).
- **Nettoyage** : toutes les valeurs monétaires sont nettoyées (suppression de "R$", espaces, points de milliers, virgule → point).
- **Structure finale** : l'objet inséré en base privilégie toujours la valeur regex, puis l'IA si besoin.

## Champs extraits
- **Nom de l'employé** : après "Nome do Funcionário" (regex), sinon entité `employee_name`.
- **Nom de l'employeur** : ligne avant/après "CNPJ" (regex), sinon entité `employer_name`.
- **Salaire de base** : après "Salário Base" (regex), sinon entité `base_salary`.
- **INSS** : ligne contenant "INSS" ou "I.N.S.S." et "Descontos" (regex), sinon entité `inss`.
- **IRRF** : ligne contenant "IRRF" ou "Imposto de Renda" et "Descontos" (regex), sinon entité `irrf`.
- **Salaire net** : après "Salário Líquido" (regex), sinon entité `net_pay`.

## Fonctionnement du code
1. **Récupération du texte brut et des entités** de la réponse Document AI.
2. **Pour chaque champ** :
   - Tente d'extraire la valeur par regex sur le texte brut.
   - Si échec, cherche la valeur dans les entités IA.
   - Nettoie la valeur si besoin (monétaire).
3. **Construit l'objet final** à insérer dans la base Supabase.

## Avantages
- **Robustesse** : fonctionne même si l'IA se trompe ou oublie un champ.
- **Adaptabilité** : facile à enrichir avec de nouveaux patterns regex ou de nouveaux champs.
- **Traçabilité** : le code logue les valeurs extraites pour faciliter le debug.

## Pour revenir à cette version
```sh
git checkout OCR-issue
```

---

Pour toute évolution, adapter les regex ou ajouter de nouveaux champs dans la logique de parsing du fichier `app/api/process-payslip/route.ts`. 