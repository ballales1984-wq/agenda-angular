import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  nome: string;
  livello: number; // 0-100
  icona: string;
  categoria: 'frontend' | 'backend' | 'tools' | 'soft';
}

interface Progetto {
  titolo: string;
  descrizione: string;
  tecnologie: string[];
  features: string[];
  link?: string;
  icona: string;
}

@Component({
  selector: 'app-portfolio-cv',
  imports: [CommonModule],
  templateUrl: './portfolio-cv.html',
  styleUrl: './portfolio-cv.css',
})
export class PortfolioCv {
  // Dati personali (personalizzabili)
  nome = 'Il Tuo Nome';
  ruolo = 'Full-Stack Developer | Angular Specialist';
  email = 'tua.email@example.com';
  github = 'https://github.com/ballales1984-wq';
  linkedin = 'https://linkedin.com/in/tuo-profilo';
  
  // Bio
  bio = `Sviluppatore appassionato con esperienza in Angular, TypeScript e architetture moderne.
Specializzato nella creazione di applicazioni web enterprise-level con focus su UX e performance.
Sempre alla ricerca di nuove tecnologie e best practices.`;
  
  // Skills
  skills = signal<Skill[]>([
    // Frontend
    { nome: 'Angular', livello: 95, icona: '🅰️', categoria: 'frontend' },
    { nome: 'TypeScript', livello: 90, icona: '📘', categoria: 'frontend' },
    { nome: 'HTML/CSS', livello: 95, icona: '🎨', categoria: 'frontend' },
    { nome: 'JavaScript', livello: 85, icona: '⚡', categoria: 'frontend' },
    { nome: 'Signals & Reactivity', livello: 90, icona: '🔄', categoria: 'frontend' },
    
    // Backend
    { nome: 'Python', livello: 80, icona: '🐍', categoria: 'backend' },
    { nome: 'Flask', livello: 75, icona: '🌶️', categoria: 'backend' },
    { nome: 'REST API', livello: 85, icona: '🔌', categoria: 'backend' },
    { nome: 'PostgreSQL', livello: 70, icona: '🐘', categoria: 'backend' },
    
    // Tools
    { nome: 'Git/GitHub', livello: 90, icona: '🔀', categoria: 'tools' },
    { nome: 'VS Code', livello: 95, icona: '💻', categoria: 'tools' },
    { nome: 'Chrome DevTools', livello: 85, icona: '🔍', categoria: 'tools' },
    { nome: 'npm/Node.js', livello: 80, icona: '📦', categoria: 'tools' },
    
    // Soft Skills
    { nome: 'Problem Solving', livello: 95, icona: '🧩', categoria: 'soft' },
    { nome: 'Learning Agility', livello: 100, icona: '🚀', categoria: 'soft' },
    { nome: 'Project Management', livello: 85, icona: '📋', categoria: 'soft' }
  ]);
  
  // Progetti
  progetti = signal<Progetto[]>([
    {
      titolo: '🧠 Assistente Intelligente Angular',
      descrizione: 'Applicazione enterprise-level per organizzazione personale con AI vocale integrata',
      tecnologie: ['Angular 19', 'TypeScript', 'Chart.js', 'jsPDF', 'Web Speech API'],
      features: [
        '💬 Chat AI con riconoscimento vocale (STT + TTS)',
        '📅 Calendario settimanale interattivo',
        '📖 Diario 3D sfogliabile con gesture touch/scroll',
        '👥 Community feed social network',
        '✨ Habits tracker con streak gamification',
        '🍅 Pomodoro timer con notifiche vocali',
        '📊 Dashboard con grafici Chart.js animati',
        '🔍 Ricerca globale instantanea',
        '📄 Export PDF automatico',
        '🌙 Dark mode completo',
        '🌍 Multilingua IT/EN',
        '💾 Auto-save ogni 5 secondi',
        '📱 PWA installabile'
      ],
      link: 'https://agenda-angular-livid.vercel.app/',
      icona: '🧠'
    },
    {
      titolo: '📝 Todo List Angular',
      descrizione: 'App per gestione task con persistenza locale e filtri avanzati',
      tecnologie: ['Angular', 'TypeScript', 'Signals', 'LocalStorage'],
      features: [
        'CRUD completo task',
        'Filtri (Tutti/Attivi/Completati)',
        'Priorità colorate (Alta/Media/Bassa)',
        'Persistenza localStorage',
        'Statistiche real-time',
        'Dark mode'
      ],
      icona: '✅'
    }
  ]);
  
  // Esperienza
  esperienze = [
    {
      ruolo: 'Angular Developer',
      azienda: 'Progetto Personale',
      periodo: new Date().getFullYear().toString(),
      descrizione: 'Sviluppo di applicazioni web enterprise con Angular 19, TypeScript e architettura modulare.',
      highlights: [
        'Conversione app Flask in Angular moderno',
        'Implementazione voice features (TTS + STT)',
        'Integrazione Chart.js per data visualization',
        'PWA development e deployment Vercel'
      ]
    }
  ];
  
  // Filtro skills
  filtroSkills = signal<'tutti' | 'frontend' | 'backend' | 'tools' | 'soft'>('tutti');
  
  get skillsFiltrate() {
    if (this.filtroSkills() === 'tutti') {
      return this.skills();
    }
    return this.skills().filter(s => s.categoria === this.filtroSkills());
  }
  
  setFiltroSkills(filtro: typeof this.filtroSkills extends signal<infer T> ? T : never) {
    this.filtroSkills.set(filtro);
  }
  
  // Download CV PDF
  downloadCV() {
    // TODO: Implementare export CV in PDF
    alert('Feature in arrivo! Per ora condividi il link del progetto online.');
  }
}
