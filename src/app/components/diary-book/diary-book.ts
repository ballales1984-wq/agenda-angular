import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiarioEntry } from '../../models/diario-entry';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech';

@Component({
  selector: 'app-diary-book',
  imports: [CommonModule, FormsModule],
  templateUrl: './diary-book.html',
  styleUrl: './diary-book.css',
})
export class DiaryBook {
  // Pagina corrente del libro (due pagine per volta)
  currentPage = signal(0);
  
  // Modalità scrittura
  isWriting = signal(false);
  
  // Nuovo entry
  newEntry = signal<Partial<DiarioEntry>>({
    data: new Date(),
    contenuto: '',
    umore: 'neutro',
    tags: []
  });
  
  // Array di moods disponibili
  moods: Array<'felice' | 'neutro' | 'triste' | 'motivato' | 'stressato'> = 
    ['felice', 'motivato', 'neutro', 'stressato', 'triste'];
  
  // Touch/Swipe handling
  private touchStartX = 0;
  private touchEndX = 0;
  
  constructor(
    public apiService: ApiService,
    public speechService: SpeechService
  ) {}
  
  // Computed per le pagine visibili
  visibleEntries = computed(() => {
    const entries = this.apiService.diario();
    const page = this.currentPage();
    
    // Due entries per pagina (pagina sinistra e destra)
    return [
      entries[page],
      entries[page + 1]
    ].filter(e => e !== undefined);
  });
  
  // Verifica se ci sono pagine precedenti
  hasPreviousPage = computed(() => this.currentPage() > 0);
  
  // Verifica se ci sono pagine successive
  hasNextPage = computed(() => {
    const entries = this.apiService.diario();
    return this.currentPage() + 2 < entries.length;
  });
  
  // Pagina precedente
  previousPage() {
    if (this.hasPreviousPage()) {
      this.addPageTurnAnimation();
      this.currentPage.update(p => Math.max(0, p - 2));
    }
  }
  
  // Pagina successiva
  nextPage() {
    if (this.hasNextPage()) {
      this.addPageTurnAnimation();
      this.currentPage.update(p => p + 2);
    }
  }
  
  // Animazione sfoglia pagina
  private addPageTurnAnimation() {
    const bookElement = document.querySelector('.book');
    if (bookElement) {
      bookElement.classList.add('page-turning');
      setTimeout(() => {
        bookElement.classList.remove('page-turning');
      }, 600);
    }
  }
  
  // Apri modalità scrittura
  startWriting() {
    this.isWriting.set(true);
    this.newEntry.set({
      data: new Date(),
      contenuto: '',
      umore: 'neutro',
      tags: []
    });
  }
  
  // Salva entry
  saveEntry() {
    const entry = this.newEntry();
    if (entry.contenuto && entry.contenuto.trim()) {
      // TODO: Chiamata API
      console.log('Saving entry:', entry);
      this.isWriting.set(false);
      this.newEntry.set({
        data: new Date(),
        contenuto: '',
        umore: 'neutro',
        tags: []
      });
    }
  }
  
  // Chiudi modalità scrittura
  cancelWriting() {
    this.isWriting.set(false);
  }
  
  // Imposta mood
  setMood(mood: 'felice' | 'neutro' | 'triste' | 'motivato' | 'stressato') {
    this.newEntry.update(entry => ({ ...entry, umore: mood }));
  }
  
  // Ottieni emoji per umore
  getMoodEmoji(umore: string): string {
    const moods: { [key: string]: string } = {
      'felice': '😊',
      'neutro': '😐',
      'triste': '😢',
      'motivato': '💪',
      'stressato': '😰'
    };
    return moods[umore] || '😐';
  }
  
  // Formatta data
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Leggi pagina corrente
  readCurrentPage() {
    const entry = this.visibleEntries()[1] || this.visibleEntries()[0];
    if (entry) {
      const text = `${this.formatDate(entry.data)}. ${entry.contenuto}`;
      this.speechService.speak(text);
    }
  }
  
  // ===== SWIPE & SCROLL HANDLING =====
  
  // Touch start
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }
  
  // Touch end - rileva swipe
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  // Gestisci swipe
  private handleSwipe() {
    const swipeThreshold = 50; // pixel minimi per considerarlo swipe
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left (verso sinistra) → Pagina successiva
        this.nextPage();
      } else {
        // Swipe right (verso destra) → Pagina precedente
        this.previousPage();
      }
    }
  }
  
  // Scroll del mouse
  onWheel(event: WheelEvent) {
    // Previeni scroll normale della pagina
    event.preventDefault();
    
    // Scroll down (ruota verso basso) → Pagina successiva
    if (event.deltaY > 0) {
      this.nextPage();
    } 
    // Scroll up (ruota verso alto) → Pagina precedente
    else if (event.deltaY < 0) {
      this.previousPage();
    }
  }
}
