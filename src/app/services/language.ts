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
    
    // Menu
    'menu.chat': { it: 'Chat', en: 'Chat' },
    'menu.calendar': { it: 'Calendario', en: 'Calendar' },
    'menu.diary': { it: 'Diario', en: 'Diary' },
    'menu.community': { it: 'Community', en: 'Community' },
    'menu.stats': { it: 'Statistiche', en: 'Statistics' },
    
    // Chat
    'chat.title': { it: 'Chat Intelligente', en: 'Smart Chat' },
    'chat.subtitle': { it: 'Scrivi in linguaggio naturale, penso a tutto io!', en: 'Write naturally, I\'ll handle everything!' },
    'chat.placeholder': { it: 'Scrivi qualcosa...', en: 'Type something...' },
    'chat.send': { it: 'Invia', en: 'Send' },
    'chat.greeting': { it: 'Ciao! 👋 Sono il tuo assistente intelligente. Dimmi cosa vuoi fare oggi!', en: 'Hi! 👋 I\'m your smart assistant. Tell me what you want to do today!' },
    
    // Calendar
    'calendar.title': { it: 'Calendario Settimanale', en: 'Weekly Calendar' },
    'calendar.today': { it: 'Oggi', en: 'Today' },
    'calendar.previous': { it: 'Precedente', en: 'Previous' },
    'calendar.next': { it: 'Successiva', en: 'Next' },
    
    // Diary
    'diary.title': { it: 'Il Mio Diario', en: 'My Diary' },
    'diary.write': { it: 'Scrivi Oggi', en: 'Write Today' },
    'diary.howDoYouFeel': { it: 'Come ti senti?', en: 'How do you feel?' },
    'diary.save': { it: 'Salva', en: 'Save' },
    'diary.cancel': { it: 'Annulla', en: 'Cancel' },
    
    // Community
    'community.title': { it: 'Community', en: 'Community' },
    'community.subtitle': { it: 'Condividi progressi, obiettivi e motiva gli altri!', en: 'Share progress, goals and motivate others!' },
    'community.newPost': { it: 'Nuovo Post', en: 'New Post' },
    'community.publish': { it: 'Pubblica', en: 'Publish' },
    'community.all': { it: 'Tutti', en: 'All' },
    'community.goal': { it: 'Obiettivo', en: 'Goal' },
    'community.success': { it: 'Successo', en: 'Success' },
    'community.motivation': { it: 'Motivazione', en: 'Motivation' },
    'community.question': { it: 'Domanda', en: 'Question' },
    
    // Stats
    'stats.title': { it: 'Le Tue Statistiche', en: 'Your Statistics' },
    'stats.total': { it: 'Totali', en: 'Total' },
    'stats.active': { it: 'Attivi', en: 'Active' },
    'stats.completed': { it: 'Completati', en: 'Completed' },
    
    // Common
    'common.like': { it: 'Mi piace', en: 'Like' },
    'common.comments': { it: 'Commenti', en: 'Comments' },
    'common.share': { it: 'Condividi', en: 'Share' },
    'common.delete': { it: 'Elimina', en: 'Delete' },
    'common.edit': { it: 'Modifica', en: 'Edit' },
    'common.close': { it: 'Chiudi', en: 'Close' },
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
