import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiarioEntry } from '../../models/diario-entry';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech';
import { PdfExportService } from '../../services/pdf-export';
import { ToastService } from '../../services/toast';
import { LanguageService } from '../../services/language';

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
    public speechService: SpeechService,
    public langService: LanguageService,
    private pdfExportService: PdfExportService,
    private toastService: ToastService
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
  
  // Aggiorna contenuto
  updateContenuto(value: string) {
    console.log('📝 Contenuto aggiornato:', value);
    this.newEntry.update(entry => ({ ...entry, contenuto: value }));
  }
  
  // Salva entry
  saveEntry() {
    console.log('💾 Tentativo salvataggio diario...');
    const entry = this.newEntry();
    console.log('📝 Entry corrente:', entry);
    
    if (entry.contenuto && entry.contenuto.trim()) {
      // SALVA DAVVERO NEL DIARIO!
      const nuovaEntry = {
        id: Date.now(),
        data: entry.data || new Date(),
        contenuto: entry.contenuto,
        umore: entry.umore || 'neutro',
        tags: entry.tags || []
      };
      
      console.log('💾 Salvataggio entry:', nuovaEntry);
      this.apiService.diario.update(diario => [...diario, nuovaEntry]);
      console.log('✅ Diario aggiornato! Totale pagine:', this.apiService.diario().length);
      
      this.toastService.success(`✅ Pagina diario salvata! Totale: ${this.apiService.diario().length} pagine`);
      
      this.isWriting.set(false);
      this.newEntry.set({
        data: new Date(),
        contenuto: '',
        umore: 'neutro',
        tags: []
      });
    } else {
      console.warn('⚠️ Contenuto vuoto, impossibile salvare');
      this.toastService.warning('Scrivi qualcosa prima di salvare!');
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
  
  // Esporta diario in PDF
  exportToPDF() {
    const entries = this.apiService.diario();
    if (entries.length === 0) {
      this.toastService.warning('Il diario è vuoto! Nessun contenuto da esportare.');
      return;
    }
    
    this.pdfExportService.exportDiario(entries, '📖 Il Mio Diario');
    this.toastService.success(`Diario esportato! ${entries.length} pagine salvate in PDF.`);
  }
  
  // DETTATURA NEL DIARIO
  async dettaNelDiario() {
    console.log('🎤 Avvio dettatura diario...');
    this.toastService.info('🎤 In ascolto...');
    
    try {
      const text = await this.speechService.startListening('it');
      console.log('🎤 Testo riconosciuto:', text);
      
      if (text && text.trim()) {
        // Aggiungi al contenuto esistente
        this.newEntry.update(entry => ({
          ...entry,
          contenuto: entry.contenuto ? entry.contenuto + ' ' + text : text
        }));
        
        console.log('✅ Testo aggiunto al diario');
        this.toastService.success('✅ Testo aggiunto!');
      } else {
        console.warn('⚠️ Nessun testo riconosciuto');
        this.toastService.warning('Nessun testo riconosciuto. Riprova!');
      }
    } catch (error) {
      console.error('❌ Errore dettatura diario:', error);
      this.toastService.error(`Errore: ${error}`);
    }
  }
  
  // CONDIVIDI ENTRY DEL DIARIO
  async condividiEntry(entry: DiarioEntry) {
    const shareUrl = `${window.location.origin}/#diary/${entry.id}`;
    const shareText = `📖 Guarda questa riflessione dal mio Diario!\n\n"${entry.contenuto.substring(0, 100)}${entry.contenuto.length > 100 ? '...' : ''}"`;
    
    // Prova Web Share API (nativa su mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Riflessione dal Diario',
          text: shareText,
          url: shareUrl
        });
        this.toastService.success('✅ Condivisione completata!');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Utente ha annullato, non mostrare errore
          return;
        }
        console.log('Web Share fallito, uso fallback');
      }
    }
    
    // Fallback: mostra opzioni social
    const choice = confirm(
      `🔗 Link creato!\n\n${shareUrl}\n\n` +
      `Premi OK per copiare il link, o ANNULLA per aprire opzioni social.`
    );
    
    if (choice) {
      // Copia negli appunti
      try {
        await navigator.clipboard.writeText(shareUrl);
        this.toastService.success('✅ Link copiato negli appunti!');
      } catch (err) {
        this.toastService.error('Errore copia link');
      }
    } else {
      // Mostra opzioni social
      this.mostraSocialOptions(shareUrl, shareText);
    }
  }
  
  // Mostra opzioni social per condivisione
  private mostraSocialOptions(shareUrl: string, shareText: string) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent('Riflessione dal mio Diario')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    
    const socialChoice = prompt(
      `Scegli dove condividere:\n\n` +
      `1 - Twitter 🐦\n` +
      `2 - WhatsApp 💬\n` +
      `3 - Facebook 📘\n` +
      `4 - Email 📧\n` +
      `5 - Copia link 📋\n\n` +
      `Digita il numero:`
    );
    
    switch(socialChoice) {
      case '1':
        window.open(twitterUrl, '_blank');
        break;
      case '2':
        window.open(whatsappUrl, '_blank');
        break;
      case '3':
        window.open(facebookUrl, '_blank');
        break;
      case '4':
        window.location.href = emailUrl;
        break;
      case '5':
        navigator.clipboard.writeText(shareUrl);
        this.toastService.success('✅ Link copiato!');
        break;
      default:
        // Copia comunque il link
        navigator.clipboard.writeText(shareUrl);
        this.toastService.info('Link copiato negli appunti');
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
