# GIBZ Studio — Application macOS 🍏

Ce dossier contient tout le nécessaire pour transformer GIBZ Studio en **vraie application Mac** (`.app` + `.dmg`), compatible **Intel et Apple Silicon** (M1/M2/M3/M4).

## Contenu du projet

| Fichier | Rôle |
|---|---|
| `index.html` | L'application GIBZ (interface + visuels + audio) |
| `main.js` | Processus principal Electron (fenêtre, menus, fichiers) |
| `preload.js` | Pont sécurisé entre l'interface et macOS |
| `package.json` | Configuration + script de compilation |
| `build/icon.icns` | Icône de l'app |
| `build/entitlements.mac.plist` | Autorisations macOS (micro, etc.) |
| `assets/icon-1024.png` | Icône source haute résolution |
| `.github/workflows/build-mac.yml` | Compilation automatique en ligne |

---

## Option A — Tu as un Mac (recommandé) 💻

1. **Installer Node.js** (version LTS) depuis <https://nodejs.org> — *une seule fois*.
2. **Décompresser** ce dossier quelque part (ex : `Documents/gibz-studio-mac`).
3. **Ouvrir le Terminal** dans ce dossier :
   - Clic droit sur le dossier → *Nouveau terminal au dossier* (ou `cd` vers le dossier).
4. **Installer les dépendances** (*une seule fois*) :
   ```bash
   npm install
   ```
5. **Tester l'app** (facultatif) :
   ```bash
   npm start
   ```
6. **Compiler l'application** :
   ```bash
   npm run dist:mac
   ```
   ⏳ Compte ~5 à 10 minutes la première fois (téléchargement d'Electron).
7. Le fichier **`release/GIBZ Studio-2.0.0-universal.dmg`** est créé 🎉
   - Double-clic → glisser **GIBZ Studio** vers **Applications**.

### Premier lancement sur Mac ⚠️

L'app n'est **pas signée Apple** (un compte développeur payant serait nécessaire), donc macOS affiche un avertissement. Pour l'ouvrir quand même :

- **Clic droit** sur GIBZ Studio → **Ouvrir** → **Ouvrir**.
- *(Une seule fois suffit, ensuite ça se lance normalement.)*

Alternative en Terminal :
```bash
xattr -cr "/Applications/GIBZ Studio.app"
```

### Autorisation micro 🎙️

À la première utilisation du micro, macOS demande l'autorisation — cliquer **OK**.
(Réglable ensuite dans *Réglages Système → Confidentialité → Microphone*.)

---

## Option B — Tu n'as pas de Mac ☁️ (compilation automatique)

GitHub compile l'app **gratuitement sur un Mac virtuel**. Il faut juste un compte GitHub (gratuit).

1. Créer un compte sur <https://github.com> (si besoin).
2. Créer un **nouveau dépôt** (*New repository*), par exemple `gibz-studio`.
3. Dans le dépôt : **Add file → Upload files** → glisser **tout le contenu** de ce dossier → **Commit**.
4. Aller dans l'onglet **Actions** :
   - Le workflow **« Build macOS app »** démarre automatiquement.
   - Attendre ~10 minutes (pastille verte ✅ = terminé).
5. Cliquer sur le build terminé → section **Artifacts** → télécharger **`GIBZ-Studio-mac`**.
   - Il contient le `.dmg` (installation) et le `.zip` (app portable).
6. Sur un Mac : ouvrir le `.dmg`, glisser dans Applications, **clic droit → Ouvrir** (voir § Premier lancement).

> 💡 À chaque fois que tu modifies `index.html` et que tu l'envoies sur GitHub, une nouvelle version est compilée automatiquement.

---

## Fonctionnalités de la version Mac

- ✅ Fenêtre sans bordure avec barre de titre GIBZ (réduire / agrandir / fermer)
- ✅ Double-clic sur un MP3, WAV, FLAC, OGG ou M4A → s'ouvre dans GIBZ
- ✅ Export vidéo WEBM et captures PNG (dialogue « Enregistrer sous »)
- ✅ Mode mini flottant (toujours au premier plan)
- ✅ Menus macOS natifs (Cmd+Q, copier/coller, plein écran…)
- ✅ Micro + permission automatique

## Personnalisation

- **Icône** : remplace `assets/icon-1024.png` (1024×1024), puis régénère le `.icns` sur Mac :
  ```bash
  mkdir -p build/AppIcon.iconset
  sips -z 16 16     assets/icon-1024.png --out build/AppIcon.iconset/icon_16x16.png
  sips -z 32 32     assets/icon-1024.png --out build/AppIcon.iconset/icon_16x16@2x.png
  sips -z 32 32     assets/icon-1024.png --out build/AppIcon.iconset/icon_32x32.png
  sips -z 64 64     assets/icon-1024.png --out build/AppIcon.iconset/icon_32x32@2x.png
  sips -z 128 128   assets/icon-1024.png --out build/AppIcon.iconset/icon_128x128.png
  sips -z 256 256   assets/icon-1024.png --out build/AppIcon.iconset/icon_128x128@2x.png
  sips -z 256 256   assets/icon-1024.png --out build/AppIcon.iconset/icon_256x256.png
  sips -z 512 512   assets/icon-1024.png --out build/AppIcon.iconset/icon_256x256@2x.png
  sips -z 512 512   assets/icon-1024.png --out build/AppIcon.iconset/icon_512x512.png
  cp assets/icon-1024.png build/AppIcon.iconset/icon_512x512@2x.png
  iconutil -c icns build/AppIcon.iconset -o build/icon.icns
  ```
- **Nom / identifiant** : champs `productName` et `appId` dans `package.json`.
