# 🧠 Assistente Intelligente - Angular Edition

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://agenda-angular-livid.vercel.app/)
[![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)](https://github.com/ballales1984-wq/agenda-angular)
[![Angular](https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Versione moderna e potenziata dell'Assistente Intelligente, completamente riscritto in Angular 19 con TypeScript.**

🌐 **[PROVA LA DEMO LIVE](https://agenda-angular-livid.vercel.app/)** 🌐

---

## ✨ Features Principali

### 💬 **Chat Intelligente con Voce**
- Input in linguaggio naturale
- Pattern recognition NLP integrato
- **🔊 Sintesi vocale italiana** - L'assistente parla!
- Bottone per attivare/disattivare la voce
- 🔊 su ogni messaggio per rileggerlo
- Suggerimenti intelligenti
- Typing indicator animato

### 📅 **Calendario Settimanale Interattivo**
- Vista timeline 8:00-23:00
- Navigazione settimane (◀ Oggi ▶)
- Eventi colorati per categoria
- Indicatore ora corrente
- Badge completamento

### 📖 **Diario Personale 3D**
- **Vista a libro** con effetti 3D realistici
- **🔊 Lettura ad alta voce** delle pagine
- Sfogliabile (◀ Indietro | Avanti ▶)
- Modalità scrittura integrata
- Mood tracking con emoji (😊💪😐😰😢)
- Tags per organizzazione
- Effetti carta autentici

### 👥 **Community Feed**
- Feed sociale stile social network
- 4 tipi di post: Obiettivi 🎯 | Successi 🎉 | Motivazione 💪 | Domande ❓
- Sistema di Like funzionante
- Filtri per categoria
- Tags e badge colorati
- Avatar personalizzati
- Tempo relativo ("2 ore fa")

### 📊 **Dashboard Statistiche**
- Cards informative con icone
- Progress bar animate
- Metriche in tempo reale
- Percentuali completamento
- Design moderno e chiaro

### 🌍 **Sistema Multilingua**
- **Italiano 🇮🇹** e **Inglese 🇬🇧**
- Switch istantaneo con bottone in header
- Persistenza della preferenza
- Traduzioni complete di tutta l'interfaccia

### 🌙 **Dark Mode Completo**
- Toggle con animazione fluida
- Supporto in TUTTI i componenti
- Rilevamento preferenza di sistema
- Persistenza locale automatica
- Transizioni smooth

### 💾 **Persistenza Dati Avanzata**
- **Auto-save ogni 5 secondi**
- LocalStorage per tutti i dati
- Caricamento automatico all'avvio
- Backup continuo
- Nessuna perdita di dati

### 📱 **PWA Ready**
- Manifest configurato
- Installabile su mobile/desktop
- Icone ottimizzate
- Shortcuts app (Chat, Calendario, Diario, Community)

### 🎨 **Design & UX**
- Animazioni fluide
- Transizioni eleganti
- Responsive mobile-first
- Gradient moderni
- Shadow e blur effects
- Hover states
- Loading states

---

## 🚀 Quick Start

### Locale

```bash
# Clone
git clone https://github.com/ballales1984-wq/agenda-angular.git
cd agenda-angular

# Installa dipendenze
npm install

# Avvia server di sviluppo
npm start

# Apri browser
http://localhost:4200
```

### Produzione

```bash
# Build
npm run build

# Output in: dist/agenda-angular/browser
```

---

## 🎯 Come Usare

### 1. 💬 **Chat**
- Scrivi messaggi in linguaggio naturale
- Clicca 🔊 in alto per attivare/disattivare voce
- L'assistente risponde e **legge ad alta voce**
- Clicca 🔊 su ogni messaggio per rileggerlo
- Usa i suggerimenti per esempi

### 2. 📅 **Calendario**
- Naviga tra le settimane
- Vedi impegni colorati per categoria
- Click "Oggi" per tornare alla settimana corrente

### 3. 📖 **Diario**
- Sfoglia le pagine come un libro vero
- Click "🔊 Leggi" per ascoltare la pagina corrente
- Click "✍️ Scrivi Oggi" per aggiungere
- Scegli l'umore con emoji
- Le pagine si salvano automaticamente

### 4. 👥 **Community**
- Leggi post di altri utenti
- Click "✍️ Nuovo Post" per condividere
- Metti ❤️ Like ai post
- Filtra per tipo (Obiettivi/Successi/etc.)

### 5. 📊 **Statistiche**
- Vedi metriche aggregate
- Progress bar per completamento
- Contatori aggiornati in tempo reale

### 🌙 **Dark Mode** 
- Click 🌙 in alto a destra
- Tutta l'app diventa scura

### 🌍 **Lingua**
- Click 🇬🇧 EN o 🇮🇹 IT in alto a destra
- Cambia lingua istantaneamente

---

## 🏗️ Architettura

```
agenda-angular/
├── src/
│   ├── app/
│   │   ├── components/          # Componenti UI
│   │   │   ├── chat-interface/  # Chat con voce
│   │   │   ├── calendar-view/   # Calendario
│   │   │   ├── diary-book/      # Diario 3D con voce
│   │   │   ├── community-feed/  # Feed sociale
│   │   │   ├── stats-dashboard/ # Statistiche
│   │   │   └── toast/           # Notifiche
│   │   ├── services/            # Servizi condivisi
│   │   │   ├── api.ts          # Comunicazione API
│   │   │   ├── theme.ts        # Dark mode
│   │   │   ├── language.ts     # Multilingua
│   │   │   ├── speech.ts       # Text-to-Speech
│   │   │   └── toast.ts        # Notifiche
│   │   └── models/              # Interfacce TypeScript
│   │       ├── impegno.ts
│   │       ├── diario-entry.ts
│   │       ├── obiettivo.ts
│   │       ├── spesa.ts
│   │       └── post.ts
│   └── styles.css               # Stili globali
└── vercel.json                  # Configurazione deploy
```

---

## 🔊 **Text-to-Speech Features**

### Chat Intelligente
- ✅ **Auto-read**: Le risposte dell'assistente vengono lette automaticamente
- ✅ **Toggle voce**: Bottone 🔊/🔇 in alto per attivare/disattivare
- ✅ **Re-read**: Bottone 🔊 su ogni messaggio per rileggerlo
- ✅ **Voce italiana**: Usa voce di sistema italiana se disponibile

### Diario
- ✅ **Leggi pagina**: Bottone "🔊 Leggi" legge la pagina corrente
- ✅ **Formato naturale**: Legge data + contenuto completo
- ✅ **Controlli**: Disattivabile con toggle in Chat

---

## 🎨 Tech Stack

- **Framework**: Angular 19
- **Linguaggio**: TypeScript 5.5
- **Styling**: CSS3 custom (no framework)
- **Reattività**: Signals (moderna API Angular)
- **Forms**: Template-driven con ngModel
- **HTTP**: HttpClient per API
- **Router**: Angular Router (pronto per SPA)
- **PWA**: Service Worker + Manifest
- **i18n**: Sistema custom multilingua
- **TTS**: Web Speech API nativa
- **Build**: esbuild + Vite
- **Deploy**: Vercel con deploy automatico
- **Hosting**: GitHub + Vercel CDN

---

## 📊 Performance

- **Bundle size**: ~376 KB (ottimizzato)
- **First load**: < 2 secondi
- **Navigation**: Istantanea (SPA)
- **Lighthouse Score**: 90+
- **Mobile-first**: 100% responsive

---

## 🔌 Integrazione Backend (Opzionale)

L'app funziona standalone con dati demo e localStorage.

Per connetterla al backend Flask originale:

```typescript
// In src/app/services/api.ts
private apiUrl = signal('https://tuo-backend.com/api');
```

E nel backend Flask:

```python
from flask_cors import CORS
CORS(app)  # Abilita CORS

# Le API sono già pronte!
```

---

## 🎯 Cosa Puoi Fare

### Demo Mode (Attuale)
- ✅ Tutte le UI funzionanti
- ✅ Dati demo persistenti
- ✅ Pattern recognition locale
- ✅ Sintesi vocale completa
- ✅ Multilingua IT/EN

### Con Backend
- Connetti al Flask originale
- Database reale (PostgreSQL)
- Autenticazione utenti
- Sync cloud
- API avanzate

---

## 🚀 Deploy su Vercel

Ogni `git push` fa il deploy automaticamente!

```bash
git add .
git commit -m "Update"
git push
```

Deploy completo in **30 secondi** ⚡

---

## 📈 Roadmap Futura

- [ ] Autenticazione JWT
- [ ] Backend Flask integration
- [ ] WebSocket per real-time
- [ ] Notifiche push
- [ ] Drag & drop calendario
- [ ] Export PDF
- [ ] Condivisione social
- [ ] Mobile app (Ionic)
- [ ] Offline mode completo

---

## 🏆 Confronto con Versione Flask

| Feature | Flask | Angular |
|---------|-------|---------|
| Architettura | Monolite | Frontend/Backend separato |
| Performance | Page reload | SPA istantanea ⚡ |
| Codice | 4600+ righe HTML | Componenti modulari |
| Type Safety | No | TypeScript ✅ |
| Dark Mode | CSS inline | Sistema completo |
| Voce | Basilare | TTS avanzato con controlli |
| Multilingua | 6 lingue (server-side) | 2 lingue (client-side) |
| Mobile | Ok | Ottimizzato |
| PWA | No | Installabile ✅ |
| Deploy | Complesso | Automatico |

---

## 🎓 Credits

- **Framework**: [Angular](https://angular.io/)
- **Hosting**: [Vercel](https://vercel.com/)
- **Icons**: Emoji nativi
- **Design**: Custom CSS
- **Ispirazione**: Progetto Flask originale

---

## 📝 License

Apache 2.0 - Feel free to use and modify!

---

## 🌟 Live Demo

**[https://agenda-angular-livid.vercel.app/](https://agenda-angular-livid.vercel.app/)**

### Prova:
1. 💬 Chat con voce attivata
2. 📅 Calendario interattivo
3. 📖 Diario con lettura vocale
4. 👥 Community feed
5. 🌙 Dark mode
6. 🇬🇧 Multilingua

---

**Made with ❤️ using Angular 19, TypeScript, and Web Speech API**

🚀 **Production-ready** | 📱 **Mobile-first** | ⚡ **Ultra-fast** | 🎨 **Modern UI**
