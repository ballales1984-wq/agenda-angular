# ✅ TEST CHECKLIST - AGENDA ANGULAR

**URL:** https://agenda-angular-livid.vercel.app/  
**Data Test:** 9 Novembre 2025  
**Browser:** Chrome / Edge (consigliato)

---

## 🧪 TEST COMPLETO FUNZIONALITÀ

### 1️⃣ **💬 CHAT INTELLIGENTE**

#### Test 1.1: Scrittura manuale
- [ ] Scrivi "Ciao" nell'input
- [ ] Click "Invia"
- [ ] ✅ L'assistente risponde
- [ ] 🔊 La risposta viene letta ad alta voce

#### Test 1.2: Riconoscimento vocale (🎤 Speech-to-Text)
- [ ] Click sul bottone 🎤 (a sinistra dell'input)
- [ ] Browser chiede permesso → Click "Consenti"
- [ ] Bottone diventa ROSSO 🔴
- [ ] **PARLA SUBITO**: "Domani riunione alle dieci"
- [ ] ✅ Testo appare nell'input
- [ ] 🔊 L'assistente dice: "Ho capito: Domani riunione alle dieci"
- [ ] ✅ FUNZIONA: ✓ **SÌ** ☐ NO

#### Test 1.3: Toggle voce
- [ ] Click sul bottone 🔊 in alto (header della chat)
- [ ] Diventa 🔇 (voce disattivata)
- [ ] Invia un messaggio → NON viene letto
- [ ] Click di nuovo → Diventa 🔊 (voce attiva)
- [ ] Invia messaggio → VIENE letto
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 1.4: Rileggi messaggio
- [ ] Click sul bottone 🔊 accanto a un messaggio dell'assistente
- [ ] Il messaggio viene riletto
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 1.5: Suggerimenti
- [ ] Click su un suggerimento (es: "Lunedì riunione dalle 10 alle 12")
- [ ] Il testo si copia nell'input
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 2️⃣ **📅 CALENDARIO**

#### Test 2.1: Visualizzazione
- [ ] Click su "📅 Calendario" nel menu
- [ ] Vedi la vista settimanale
- [ ] Vedi almeno 2-3 impegni colorati
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 2.2: Navigazione
- [ ] Click "◀ Precedente" → Settimana cambia
- [ ] Click "Successiva ▶" → Va avanti
- [ ] Click "Oggi" → Torna alla settimana corrente
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 2.3: Eventi colorati
- [ ] Vedi eventi di colori diversi (blu=lavoro, viola=studio, etc.)
- [ ] Hover su evento → Si evidenzia
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 3️⃣ **📖 DIARIO**

#### Test 3.1: Visualizzazione libro
- [ ] Click su "📖 Diario"
- [ ] Vedi il libro 3D aperto con 2 pagine
- [ ] Vedi almeno 1-3 pagine di diario
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 3.2: Swipe su mobile / Scroll su PC
- [ ] **SU PC**: Scroll con la rotella del mouse sul libro
- [ ] Le pagine cambiano
- [ ] **SU MOBILE**: Swipe left/right sul libro
- [ ] Le pagine cambiano
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 3.3: Bottoni navigazione
- [ ] Click "◀ Indietro" → Pagina precedente
- [ ] Click "Avanti ▶" → Pagina successiva
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 3.4: Lettura vocale pagina (🔊)
- [ ] Click "🔊 Leggi"
- [ ] La pagina viene letta ad alta voce
- [ ] Dice data + contenuto
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 3.5: Esportazione PDF (📄)
- [ ] Click "📄 PDF"
- [ ] Si scarica un file PDF
- [ ] Apri il PDF → Vedi tutte le pagine formattate
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 3.6: Scrivi nuova pagina
- [ ] Click "✍️ Scrivi Oggi"
- [ ] Si apre form di scrittura
- [ ] Scrivi qualcosa nel textarea
- [ ] Scegli un umore (😊💪😐😰😢)
- [ ] Click "💾 Salva"
- [ ] Pagina aggiunta (verifica ricaricando)
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 4️⃣ **👥 COMMUNITY**

#### Test 4.1: Visualizzazione feed
- [ ] Click su "👥 Community"
- [ ] Vedi 4 post demo
- [ ] Ogni post ha avatar, contenuto, tipo, like
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 4.2: Like
- [ ] Click "❤️ Mi piace" su un post
- [ ] Il numero aumenta
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 4.3: Filtri
- [ ] Click su "🎯 Obiettivi" → Vedi solo obiettivi
- [ ] Click su "🎉 Successi" → Vedi solo successi
- [ ] Click su "Tutti" → Vedi tutto
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 4.4: Crea post
- [ ] Click "✍️ Nuovo Post"
- [ ] Si apre form
- [ ] Scrivi qualcosa
- [ ] Scegli tipo (Motivazione, Obiettivo, etc.)
- [ ] Click "📤 Pubblica"
- [ ] Post appare in cima al feed
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 5️⃣ **✨ ABITUDINI (HABITS TRACKER)**

#### Test 5.1: Visualizzazione
- [ ] Click su "✨ Abitudini"
- [ ] Vedi 4 card abitudini (Meditazione, Esercizio, Leggere, Acqua)
- [ ] Ogni card ha emoji, nome, streak 🔥, totale
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 5.2: Completamento oggi
- [ ] Click sul ○ grande in una card
- [ ] Diventa ✓ verde
- [ ] Appare toast notification "✅ [Nome] completato oggi!"
- [ ] Il numero 🔥 streak potrebbe aumentare
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 5.3: Visualizzazione 7 giorni
- [ ] Vedi 7 puntini sotto ogni card
- [ ] Puntini verdi = giorni completati
- [ ] Puntini grigi = giorni non fatti
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 6️⃣ **🍅 POMODORO TIMER**

#### Test 6.1: Avvio timer
- [ ] Click su "🍅 Pomodoro"
- [ ] Vedi cerchio con tempo 25:00
- [ ] Click "▶️ Inizia"
- [ ] Timer parte (conta giù)
- [ ] Cerchio si riempie progressivamente
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 6.2: Pausa
- [ ] Durante il timer, click "⏸️ Pausa"
- [ ] Timer si ferma
- [ ] Click "▶️ Inizia" → Riprende
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 6.3: Reset
- [ ] Click "🔄 Reset"
- [ ] Timer torna a 25:00
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 6.4: Cambio modalità
- [ ] Click "☕ Pausa (5')"
- [ ] Timer cambia a 05:00
- [ ] Colore del cerchio cambia
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 6.5: Completamento (OPZIONALE - lungo!)
- [ ] Avvia timer e aspetta 25 minuti (o modifica il codice per 10 secondi)
- [ ] Al termine: Notifica vocale "Pomodoro completato!"
- [ ] Toast notification verde
- [ ] Auto-switch a pausa
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 7️⃣ **📊 STATISTICHE**

#### Test 7.1: Cards statistiche
- [ ] Click su "📊 Statistiche"
- [ ] Vedi 4 cards (Impegni, Obiettivi, Diario, Spese)
- [ ] Ogni card ha numero e progress bar
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 7.2: Grafici Chart.js
- [ ] Scroll in basso
- [ ] Vedi 2 grafici:
  - Grafico Doughnut (Impegni completati)
  - Grafico Bar (Spese per categoria)
- [ ] I grafici sono animati
- [ ] Hover su grafici → Tooltip con dettagli
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 8️⃣ **🔍 RICERCA GLOBALE**

#### Test 8.1: Apertura ricerca
- [ ] Vedi il bottone 🔍 in basso a destra (FAB)
- [ ] Click sul 🔍
- [ ] Si apre modal di ricerca
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 8.2: Ricerca
- [ ] Digita "studio" nella ricerca
- [ ] Vedi risultati da impegni/diario/obiettivi
- [ ] Ogni risultato ha icona, titolo, tipo, data
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 8.3: Chiusura
- [ ] Premi ESC o click fuori → Modal si chiude
- [ ] Click ✕ → Modal si chiude
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 9️⃣ **🌙 DARK MODE**

#### Test 9.1: Toggle dark mode
- [ ] Click sul bottone 🌙 in alto a destra
- [ ] **TUTTA** l'app diventa scura
- [ ] Header, menu, contenuti, footer → tutto scuro
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 9.2: Persistenza
- [ ] Attiva dark mode (🌙)
- [ ] Ricarica la pagina (F5)
- [ ] Dark mode ancora attivo
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 9.3: Light mode
- [ ] Click ☀️ → Torna chiaro
- [ ] Tutto torna normale
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 🔟 **🌍 MULTILINGUA**

#### Test 10.1: Switch lingua
- [ ] Click su "🇬🇧 EN" in alto a destra
- [ ] Titolo diventa "Smart Assistant"
- [ ] Sottotitolo diventa inglese
- [ ] Menu tradotto (Chat → Chat, Calendario → Calendar, etc.)
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 10.2: Persistenza lingua
- [ ] Cambia in inglese
- [ ] Ricarica pagina
- [ ] Ancora in inglese
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 10.3: Voce multilingua
- [ ] In modalità EN, usa il microfono 🎤
- [ ] Parla in inglese
- [ ] Dovrebbe riconoscere inglese
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 1️⃣1️⃣ **💾 PERSISTENZA DATI**

#### Test 11.1: Auto-save
- [ ] Vai nel Diario → Scrivi una nuova pagina
- [ ] Click "Salva"
- [ ] **RICARICA la pagina** (F5)
- [ ] Torna al Diario
- [ ] La nuova pagina c'è ancora!
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 11.2: Community posts persistenti
- [ ] Crea un nuovo post nella Community
- [ ] Ricarica pagina
- [ ] Il post c'è ancora
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 1️⃣2️⃣ **🔔 TOAST NOTIFICATIONS**

#### Test 12.1: Notifiche visibili
- [ ] Completa un'abitudine → Vedi toast verde in alto a destra
- [ ] Elimina qualcosa → Vedi toast
- [ ] Le toast spariscono dopo 3 secondi
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 1️⃣3️⃣ **📱 RESPONSIVE MOBILE**

#### Test 13.1: Mobile layout
- [ ] Apri da smartphone (o riduci finestra < 768px)
- [ ] Menu diventa verticale/compatto
- [ ] Componenti si adattano
- [ ] Tutto leggibile
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 13.2: Touch gestures
- [ ] Su mobile, vai nel Diario
- [ ] Swipe LEFT sul libro → Pagina successiva
- [ ] Swipe RIGHT → Pagina precedente
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

### 1️⃣4️⃣ **⚡ PERFORMANCE**

#### Test 14.1: Caricamento
- [ ] Apri l'app
- [ ] Caricamento < 5 secondi
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

#### Test 14.2: Navigazione
- [ ] Passa tra menu (Chat → Calendario → Diario)
- [ ] Cambio **istantaneo** (no reload)
- [ ] Animazioni fluide
- [ ] ✅ FUNZIONA: ☐ SÌ ☐ NO

---

## 🎯 **TEST SCENARIO COMPLETO**

### Scenario A: "Organizzazione Giornata"

1. [ ] Apri Chat
2. [ ] Click 🎤 e di': "Domani riunione alle dieci"
3. [ ] Ascolta conferma vocale
4. [ ] Vai in Calendario
5. [ ] Verifica che l'impegno sia lì (se connesso a backend)

### Scenario B: "Diario Personale"

1. [ ] Vai nel Diario
2. [ ] Click "✍️ Scrivi Oggi"
3. [ ] Scrivi un pensiero
4. [ ] Scegli umore 😊
5. [ ] Click "Salva"
6. [ ] Click "🔊 Leggi" → Ascolta
7. [ ] Click "📄 PDF" → Scarica PDF
8. [ ] Apri PDF e verifica contenuto

### Scenario C: "Produttività Pomodoro"

1. [ ] Vai in Pomodoro
2. [ ] Click "▶️ Inizia"
3. [ ] Lavora per un po'
4. [ ] Click "⏸️ Pausa" se necessario
5. [ ] Click "🔄 Reset"

### Scenario D: "Abitudini Giornaliere"

1. [ ] Vai in Abitudini
2. [ ] Click sul ○ di "Meditazione"
3. [ ] Diventa ✓ verde
4. [ ] Vedi toast "✅ Meditazione completato oggi!"
5. [ ] Ricarica pagina
6. [ ] Ancora verde

---

## 📊 **RISULTATI TEST**

### ✅ **Funzionalità Principali:**
- Chat: ☐ OK ☐ Problemi
- Calendario: ☐ OK ☐ Problemi
- Diario: ☐ OK ☐ Problemi
- Community: ☐ OK ☐ Problemi
- Abitudini: ☐ OK ☐ Problemi
- Pomodoro: ☐ OK ☐ Problemi
- Statistiche: ☐ OK ☐ Problemi

### 🔊 **Features Vocali:**
- Text-to-Speech (🔊): ☐ OK ☐ Problemi
- Speech-to-Text (🎤): ☐ OK ☐ Problemi
- Rileggi messaggi: ☐ OK ☐ Problemi
- Lettura diario: ☐ OK ☐ Problemi

### 🎨 **UX Features:**
- Dark Mode: ☐ OK ☐ Problemi
- Multilingua: ☐ OK ☐ Problemi
- Swipe gestures: ☐ OK ☐ Problemi
- Toast notifications: ☐ OK ☐ Problemi
- Ricerca globale: ☐ OK ☐ Problemi

### 💾 **Persistenza:**
- Auto-save: ☐ OK ☐ Problemi
- Ricarica pagina: ☐ OK ☐ Problemi

---

## 🐛 **BUG TROVATI**

Lista eventuali problemi:

1. ___________________________________
2. ___________________________________
3. ___________________________________

---

## 📝 **NOTE**

Browser testato: _______________________  
OS: _______________________  
Dispositivo: _______________________ (PC/Mobile)

---

## ✅ **CONCLUSIONE**

**TEST SUPERATO:** ☐ SÌ ☐ CON RISERVE ☐ NO

**Percentuale funzionalità OK:** ______ %

**Pronto per produzione:** ☐ SÌ ☐ NO

**Note finali:**
_________________________________________
_________________________________________
_________________________________________

---

**Tester:** ________________  
**Data:** 9 Novembre 2025  
**Firma:** ________________

