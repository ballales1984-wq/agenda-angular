import { Injectable, signal, effect } from '@angular/core';

export type Language = 'it' | 'en';

interface Translations {
  [key: string]: {
    it: string;
    en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Lingua corrente
  currentLang = signal<Language>('it');
  
  // Traduzioni
  private translations: Translations = {
    // App generale
    'app.title': { it: 'Assistente Intelligente', en: 'Smart Assistant' },
    'app.subtitle': { it: 'Il tuo compagno AI per organizzare vita, studio e obiettivi', en: 'Your AI companion to organize life, study and goals' },
    
    // Menu Navigation
    'menu.chat': { it: '💬 Chat', en: '💬 Chat' },
    'menu.calendar': { it: '📅 Calendario', en: '📅 Calendar' },
    'menu.diary': { it: '📖 Diario', en: '📖 Diary' },
    'menu.community': { it: '👥 Community', en: '👥 Community' },
    'menu.obiettivi': { it: '🎯 Obiettivi', en: '🎯 Goals' },
    'menu.habits': { it: '✨ Abitudini', en: '✨ Habits' },
    'menu.pomodoro': { it: '🍅 Pomodoro', en: '🍅 Pomodoro' },
    'menu.stats': { it: '📊 Statistiche', en: '📊 Statistics' },
    
    // Chat
    'chat.title': { it: 'Chat Intelligente', en: 'Smart Chat' },
    'chat.subtitle': { it: 'Scrivi in linguaggio naturale, penso a tutto io!', en: 'Write naturally, I\'ll handle everything!' },
    'chat.placeholder': { it: 'Scrivi qualcosa...', en: 'Type something...' },
    'chat.send': { it: 'Invia', en: 'Send' },
    'chat.greeting': { it: 'Ciao! 👋 Sono il tuo assistente intelligente. Dimmi cosa vuoi fare oggi!', en: 'Hi! 👋 I\'m your smart assistant. Tell me what you want to do today!' },
    'chat.suggestions': { it: 'Suggerimenti:', en: 'Suggestions:' },
    
    // Calendar
    'calendar.title': { it: 'Calendario Settimanale', en: 'Weekly Calendar' },
    'calendar.today': { it: 'Oggi', en: 'Today' },
    'calendar.previous': { it: '◀ Settimana Precedente', en: '◀ Previous Week' },
    'calendar.next': { it: 'Settimana Successiva ▶', en: 'Next Week ▶' },
    'calendar.noEvents': { it: 'Nessun impegno per questa settimana', en: 'No commitments for this week' },
    
    // Diary
    'diary.title': { it: '📖 Il Mio Diario', en: '📖 My Diary' },
    'diary.write': { it: '✍️ Scrivi Oggi', en: '✍️ Write Today' },
    'diary.read': { it: '🔊 Leggi', en: '🔊 Read' },
    'diary.export': { it: '📄 PDF', en: '📄 PDF' },
    'diary.writeThought': { it: '✍️ Scrivi il tuo pensiero', en: '✍️ Write your thought' },
    'diary.howDoYouFeel': { it: 'Come ti senti?', en: 'How do you feel?' },
    'diary.save': { it: '💾 Salva Pagina', en: '💾 Save Page' },
    'diary.cancel': { it: '❌ Annulla', en: '❌ Cancel' },
    'diary.placeholder': { it: 'Come ti senti oggi? Cosa hai fatto? Cosa hai imparato?...', en: 'How do you feel today? What did you do? What did you learn?...' },
    'diary.share': { it: '🔗 Condividi', en: '🔗 Share' },
    'diary.noPage': { it: 'Nessuna pagina qui', en: 'No page here' },
    'diary.previous': { it: '◀ Indietro', en: '◀ Back' },
    'diary.next': { it: 'Avanti ▶', en: 'Next ▶' },
    
    // Obiettivi
    'goals.title': { it: '🎯 I Tuoi Obiettivi', en: '🎯 Your Goals' },
    'goals.create': { it: '➕ Nuovo Obiettivo', en: '➕ New Goal' },
    'goals.noGoals': { it: 'Nessun obiettivo ancora. Creane uno per iniziare!', en: 'No goals yet. Create one to get started!' },
    'goals.name': { it: 'Nome obiettivo', en: 'Goal name' },
    'goals.description': { it: 'Descrizione', en: 'Description' },
    'goals.category': { it: 'Categoria', en: 'Category' },
    'goals.frequency': { it: 'Frequenza', en: 'Frequency' },
    'goals.hoursNeeded': { it: 'Ore necessarie', en: 'Hours needed' },
    'goals.hoursCompleted': { it: 'Ore completate', en: 'Hours completed' },
    'goals.progress': { it: 'Progresso', en: 'Progress' },
    'goals.addHours': { it: 'Aggiungi Ore', en: 'Add Hours' },
    'goals.complete': { it: '✅ Completa', en: '✅ Complete' },
    'goals.delete': { it: '🗑️ Elimina', en: '🗑️ Delete' },
    'goals.save': { it: 'Salva', en: 'Save' },
    'goals.cancel': { it: 'Annulla', en: 'Cancel' },
    
    // Category
    'category.study': { it: 'Studio', en: 'Study' },
    'category.work': { it: 'Lavoro', en: 'Work' },
    'category.health': { it: 'Salute', en: 'Health' },
    'category.personal': { it: 'Personale', en: 'Personal' },
    
    // Frequency
    'frequency.daily': { it: 'Giornaliero', en: 'Daily' },
    'frequency.weekly': { it: 'Settimanale', en: 'Weekly' },
    'frequency.monthly': { it: 'Mensile', en: 'Monthly' },
    
    // Habits
    'habits.title': { it: '✨ Tracker Abitudini', en: '✨ Habits Tracker' },
    'habits.add': { it: '➕ Nuova Abitudine', en: '➕ New Habit' },
    'habits.streak': { it: 'Streak', en: 'Streak' },
    'habits.days': { it: 'giorni', en: 'days' },
    
    // Pomodoro
    'pomodoro.title': { it: '🍅 Pomodoro Timer', en: '🍅 Pomodoro Timer' },
    'pomodoro.work': { it: 'Lavoro', en: 'Work' },
    'pomodoro.break': { it: 'Pausa', en: 'Break' },
    'pomodoro.start': { it: 'Avvia', en: 'Start' },
    'pomodoro.pause': { it: 'Pausa', en: 'Pause' },
    'pomodoro.reset': { it: 'Reset', en: 'Reset' },
    'pomodoro.session': { it: 'Sessione', en: 'Session' },
    
    // Community
    'community.title': { it: 'Community', en: 'Community' },
    'community.subtitle': { it: 'Condividi progressi, obiettivi e motiva gli altri!', en: 'Share progress, goals and motivate others!' },
    'community.newPost': { it: '➕ Nuovo Post', en: '➕ New Post' },
    'community.publish': { it: 'Pubblica', en: 'Publish' },
    'community.all': { it: 'Tutti', en: 'All' },
    'community.goal': { it: 'Obiettivo', en: 'Goal' },
    'community.success': { it: 'Successo', en: 'Success' },
    'community.motivation': { it: 'Motivazione', en: 'Motivation' },
    'community.question': { it: 'Domanda', en: 'Question' },
    
    // Stats
    'stats.title': { it: '📊 Le Tue Statistiche', en: '📊 Your Statistics' },
    'stats.total': { it: 'Totali', en: 'Total' },
    'stats.active': { it: 'Attivi', en: 'Active' },
    'stats.completed': { it: 'Completati', en: 'Completed' },
    'stats.thisWeek': { it: 'Questa Settimana', en: 'This Week' },
    'stats.thisMonth': { it: 'Questo Mese', en: 'This Month' },
    
    // Search
    'search.title': { it: '🔍 Ricerca Globale', en: '🔍 Global Search' },
    'search.placeholder': { it: 'Cerca in impegni, diario, obiettivi...', en: 'Search in commitments, diary, goals...' },
    'search.noResults': { it: 'Nessun risultato trovato', en: 'No results found' },
    
    // Common
    'common.like': { it: 'Mi piace', en: 'Like' },
    'common.comments': { it: 'Commenti', en: 'Comments' },
    'common.share': { it: 'Condividi', en: 'Share' },
    'common.delete': { it: 'Elimina', en: 'Delete' },
    'common.edit': { it: 'Modifica', en: 'Edit' },
    'common.close': { it: 'Chiudi', en: 'Close' },
    'common.save': { it: 'Salva', en: 'Save' },
    'common.cancel': { it: 'Annulla', en: 'Cancel' },
    'common.add': { it: 'Aggiungi', en: 'Add' },
    'common.loading': { it: 'Caricamento...', en: 'Loading...' },
  };
  
  constructor() {
    // Carica lingua salvata
    const saved = localStorage.getItem('language');
    if (saved === 'it' || saved === 'en') {
      this.currentLang.set(saved);
    } else {
      // Rileva lingua browser
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('it')) {
        this.currentLang.set('it');
      } else {
        this.currentLang.set('en');
      }
    }
    
    // Salva quando cambia
    effect(() => {
      localStorage.setItem('language', this.currentLang());
    });
  }
  
  // Traduci una chiave
  t(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLang()];
  }
  
  // Cambia lingua
  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }
  
  // Toggle lingua
  toggleLanguage() {
    this.currentLang.update(lang => lang === 'it' ? 'en' : 'it');
  }
}
