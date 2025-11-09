import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiarioEntry } from '../../models/diario-entry';
import { ApiService } from '../../services/api';

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
  
  constructor(public apiService: ApiService) {}
  
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
      this.currentPage.update(p => Math.max(0, p - 2));
    }
  }
  
  // Pagina successiva
  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.update(p => p + 2);
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
}
