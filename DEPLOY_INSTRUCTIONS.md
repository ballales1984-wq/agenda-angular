# 🚀 Deploy Instructions

## Step 1: Crea Repository GitHub

1. Vai su https://github.com/new
2. Nome repository: `agenda-angular`
3. Lascia **Public** o scegli **Private**
4. **NON** aggiungere README, .gitignore o license (già presenti)
5. Clicca "Create repository"

## Step 2: Collega Git a GitHub

Copia e incolla questi comandi nel terminale (sostituisci `TUO-USERNAME`):

```bash
git remote add origin https://github.com/TUO-USERNAME/agenda-angular.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy su Vercel

### Opzione A: Da GitHub (AUTOMATICO)

1. Vai su https://vercel.com
2. Clicca "Sign Up" → Login con GitHub
3. Clicca "Import Project"
4. Seleziona il repository `agenda-angular`
5. Framework: **Angular** (riconosciuto automaticamente)
6. Clicca "Deploy"
7. ✅ FATTO! Il tuo URL sarà tipo: `https://agenda-angular-xyz.vercel.app`

### Opzione B: Da CLI

```bash
npm i -g vercel
vercel login
vercel
```

Segui le istruzioni e conferma!

---

## 🔄 Deploy Automatico

Ogni volta che fai:
```bash
git add .
git commit -m "Aggiornamento"
git push
```

Vercel fa il deploy automaticamente in 30 secondi! 🚀

---

## 🌐 URL Finale

Dopo il deploy avrai:
- 🌐 URL principale: `https://agenda-angular.vercel.app`
- 🔒 HTTPS automatico
- ⚡ CDN globale ultra veloce
- 📱 Ottimizzato per mobile

---

## 📊 Features Online

✅ Chat intelligente
✅ Calendario interattivo
✅ Diario 3D
✅ Community feed
✅ Statistiche
✅ Dark mode
✅ Responsive
✅ PWA ready

