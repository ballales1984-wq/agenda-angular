# 📊 Google Analytics - Setup Guide

## 🎯 Come Configurare Google Analytics

### **STEP 1: Crea Account Google Analytics**

1. Vai su: **https://analytics.google.com/**
2. Click **"Inizia misurazione"** (o "Start measuring")
3. Crea un **Account** (es: "Agenda Angular")
4. Crea una **Proprietà** (es: "Assistente Intelligente")
5. Seleziona **"Web"** come piattaforma
6. Inserisci URL: **https://agenda-angular-livid.vercel.app/**
7. Click **"Crea stream"**

### **STEP 2: Ottieni il Measurement ID**

Dopo aver creato lo stream, vedrai:
```
ID misurazione: G-XXXXXXXXXX
```

**Copia questo ID!** 📋

---

### **STEP 3: Aggiungi l'ID all'App**

Apri il file:
```
agenda-angular/src/index.html
```

E cerca questa riga:
```html
gtag('config', 'G-XXXXXXXXXX', {
```

**Sostituisci** `G-XXXXXXXXXX` con il **TUO ID** (quello che hai copiato).

Esempio:
```html
gtag('config', 'G-ABC123XYZ', {
```

---

### **STEP 4: Commit e Push**

```bash
cd agenda-angular
git add src/index.html
git commit -m "📊 Add: Google Analytics tracking ID"
git push
```

Vercel fa il deploy automatico in 30 secondi!

---

### **STEP 5: Verifica che Funzioni**

1. Vai su Google Analytics Dashboard
2. Click su **"Realtime"** (Tempo reale)
3. Apri il tuo sito: https://agenda-angular-livid.vercel.app/
4. Dovresti vedere **1 utente attivo** in tempo reale! 🎉

---

## 📊 COSA TRACCIA L'APP

### **Eventi Automatici:**
- ✅ Page views (visualizzazioni pagina)
- ✅ Sessioni utente
- ✅ Dispositivi (mobile/desktop)
- ✅ Località geografica
- ✅ Browser utilizzato

### **Eventi Custom Implementati:**

#### **Chat:**
- `chat_message` - Quando invii/ricevi messaggi
- `voice_input_used` - Quando usi il microfono 🎤
- `voice_output_used` - Quando attivi la voce 🔊

#### **Diario:**
- `diary_page_turn` - Quando sfogli (swipe/scroll/button)
- `diary_read_aloud` - Quando clicchi "🔊 Leggi"
- `pdf_export` - Quando esporti in PDF

#### **Pomodoro:**
- `pomodoro_started` - Quando avvii il timer
- `pomodoro_completed` - Quando completi un pomodoro

#### **Habits:**
- `habit_toggle` - Quando segni un'abitudine

#### **Community:**
- `community_post_created` - Quando crei un post
- `community_like` - Quando metti like

#### **UI:**
- `theme_changed` - Quando cambi tema (dark/light)
- `language_changed` - Quando cambi lingua (IT/EN)
- `search_performed` - Quando usi la ricerca

---

## 📈 METRICHE CHE VEDRAI

### **Dashboard Google Analytics:**

**Tempo Reale:**
- Utenti attivi ora
- Pagine visualizzate
- Eventi in corso

**Rapporti:**
- Utenti giornalieri/settimanali/mensili
- Sessioni medie
- Durata sessione
- Bounce rate
- Pagine più viste

**Eventi:**
- Quante volte usano il microfono 🎤
- Quante volte sfogliano il diario
- Quanti pomodori completati
- Quanti post creati
- Quanti PDF esportati
- Dark mode usage
- Lingua preferita

**Dispositivi:**
- Mobile vs Desktop
- Browser utilizzati
- Sistema operativo
- Risoluzione schermo

**Geografia:**
- Da dove vengono gli utenti
- Città principali
- Mappa mondiale

---

## 🎯 COME USARE I DATI

### **Ottimizzazione:**
- Vedi quali features usano di più
- Ottimizza quelle più popolari
- Rimuovi/migliora quelle meno usate

### **Marketing:**
- Scopri da dove arrivano gli utenti
- Capisci quali device usano
- Adatta il design di conseguenza

### **Performance:**
- Monitora tempo di caricamento
- Vedi bounce rate
- Migliora retention

---

## 🚀 EVENTI GIÀ PRONTI

Il codice Analytics è già pronto!

Quando fai queste azioni nell'app, vengono tracciate automaticamente:

- ✅ Click 🎤 → `voice_input_used`
- ✅ Click 🔊 → `voice_output_used`
- ✅ Sfoglia diario → `diary_page_turn`
- ✅ Export PDF → `pdf_export`
- ✅ Avvia Pomodoro → `pomodoro_started`
- ✅ Toggle abitudine → `habit_toggle`
- ✅ Crea post → `community_post_created`
- ✅ Metti like → `community_like`
- ✅ Cambia tema → `theme_changed`
- ✅ Cambia lingua → `language_changed`
- ✅ Usa ricerca → `search_performed`

---

## 📝 TODO PER COMPLETARE:

1. **Vai su**: https://analytics.google.com/
2. **Crea account** e proprietà
3. **Copia il Measurement ID** (G-XXXXXXXXXX)
4. **Dimmi l'ID** e lo aggiungo nell'app
5. **Push su GitHub**
6. **Deploy automatico**
7. **✅ Analytics attivo!**

---

**Hai già un account Google Analytics? Se sì, dammi il Measurement ID e lo configuro!** 📊

Oppure vuoi che ti guidi nella creazione dell'account? 🎯
