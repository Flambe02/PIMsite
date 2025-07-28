# 🖥️ Guide de Résolution des Problèmes de Démarrage sur Windows

## 🎯 **Problème Identifié**

Erreur lors du démarrage en mode développement :
```
Error: EPERM: operation not permitted, open 'C:\Users\flore\OneDrive\POIVRON ROUGE\PIM\PIMsite\.next\trace'
```

## 🔧 **Solution Complète**

### **Étape 1 : Arrêter Tous les Processus Node.js**
```powershell
taskkill /f /im node.exe
```

### **Étape 2 : Nettoyer les Dossiers de Cache**
```powershell
# Supprimer le dossier .next
Remove-Item -Recurse -Force .next

# Supprimer node_modules (optionnel, si problème persiste)
Remove-Item -Recurse -Force node_modules
```

### **Étape 3 : Réinstaller les Dépendances**
```powershell
pnpm install
```

### **Étape 4 : Redémarrer le Serveur de Développement**
```powershell
pnpm dev
```

## 🚨 **Causes Possibles**

1. **Processus Node.js Bloqués** : Plusieurs instances de Node.js en cours
2. **Permissions Windows** : Problèmes d'accès aux fichiers
3. **Cache Corrompu** : Dossier `.next` corrompu
4. **OneDrive Sync** : Conflits avec la synchronisation OneDrive

## 🛠️ **Solutions Alternatives**

### **Option 1 : Mode Administrateur**
```powershell
# Ouvrir PowerShell en tant qu'administrateur
Start-Process powershell -Verb runAs
cd "C:\Users\flore\OneDrive\POIVRON ROUGE\PIM\PIMsite"
pnpm dev
```

### **Option 2 : Désactiver OneDrive Temporairement**
1. Clic droit sur l'icône OneDrive
2. "Pause la synchronisation" → "2 heures"
3. Relancer `pnpm dev`

### **Option 3 : Port Différent**
```powershell
# Forcer un port spécifique
pnpm dev --port 3005
```

### **Option 4 : Nettoyage Complet**
```powershell
# Arrêter tous les processus
taskkill /f /im node.exe

# Nettoyer complètement
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml

# Réinstaller
pnpm install
pnpm dev
```

## 🔍 **Prévention**

### **1. Toujours Arrêter le Serveur Proprement**
```powershell
# Ctrl+C dans le terminal
# Ou fermer le terminal
```

### **2. Éviter les Fermetures Brutales**
- Ne pas fermer le terminal pendant que `pnpm dev` tourne
- Utiliser `Ctrl+C` pour arrêter proprement

### **3. Vérifier les Processus**
```powershell
# Vérifier les processus Node.js en cours
Get-Process node -ErrorAction SilentlyContinue
```

### **4. Ports Disponibles**
```powershell
# Vérifier les ports utilisés
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

## 🎯 **Résultats Attendus**

Après ces étapes :
- ✅ **Serveur Démarre** : Sans erreur EPERM
- ✅ **Port Disponible** : Généralement 3000, sinon 3001, 3002, etc.
- ✅ **Application Accessible** : `http://localhost:3000/br`
- ✅ **Pas de Redirection** : Reste sur localhost

## 🚀 **Test de Validation**

1. **Accédez à l'application :**
   ```
   http://localhost:3000/br
   ```

2. **Vérifiez que vous restez sur localhost :**
   - Pas de redirection vers Vercel
   - Navigation fluide

3. **Testez l'upload :**
   - Le popup d'upload ne doit plus être coupé
   - Toute la checklist doit être visible

## 🔧 **Si le Problème Persiste**

### **Solution Radicale**
```powershell
# Redémarrer l'ordinateur
Restart-Computer

# Puis relancer
cd "C:\Users\flore\OneDrive\POIVRON ROUGE\PIM\PIMsite"
pnpm dev
```

### **Alternative : Docker**
```dockerfile
# Si nécessaire, utiliser Docker pour éviter les problèmes Windows
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

**🎯 Le serveur de développement devrait maintenant démarrer sans problème !** 