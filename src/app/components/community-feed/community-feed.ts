import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-community-feed',
  imports: [CommonModule, FormsModule],
  templateUrl: './community-feed.html',
  styleUrl: './community-feed.css',
})
export class CommunityFeed {
  // Posts della community
  posts = signal<Post[]>([
    {
      id: 1,
      autore: 'Marco Rossi',
      avatar: '👨‍💼',
      contenuto: 'Ho completato il mio primo progetto Angular! 🎉 Non ci posso credere, un mese fa non sapevo nemmeno cosa fosse un componente. Grazie a tutti per il supporto!',
      tipo: 'successo',
      likes: 24,
      commenti: 5,
      data: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['angular', 'programmazione', 'successo']
    },
    {
      id: 2,
      autore: 'Sara Bianchi',
      avatar: '👩‍💻',
      contenuto: 'Obiettivo della settimana: studiare TypeScript 2 ore al giorno. Chi si unisce a me? 💪',
      tipo: 'obiettivo',
      likes: 18,
      commenti: 12,
      data: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tags: ['typescript', 'studio', 'obiettivi']
    },
    {
      id: 3,
      autore: 'Luca Verdi',
      avatar: '🧑‍🎓',
      contenuto: 'Qualcuno ha esperienza con i Signals in Angular? Ho qualche dubbio su come usarli al meglio nel mio progetto.',
      tipo: 'domanda',
      likes: 8,
      commenti: 7,
      data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['angular', 'signals', 'aiuto']
    },
    {
      id: 4,
      autore: 'Giulia Neri',
      avatar: '👩‍🔬',
      contenuto: 'Non mollare mai! 🌟 Ricorda: ogni esperto è stato una volta un principiante. Continua a imparare e crescere ogni giorno! ✨',
      tipo: 'motivazione',
      likes: 42,
      commenti: 15,
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['motivazione', 'ispirazione']
    }
  ]);
  
  // Filtro attivo
  filtroAttivo = signal<'tutti' | 'obiettivo' | 'successo' | 'motivazione' | 'domanda'>('tutti');
  
  // Form nuovo post
  isCreatingPost = signal(false);
  nuovoPost = signal({
    contenuto: '',
    tipo: 'motivazione' as 'obiettivo' | 'successo' | 'motivazione' | 'domanda',
    tags: [] as string[]
  });
  
  constructor(public langService: LanguageService) {}
  
  // Posts filtrati
  get postsFiltrati() {
    if (this.filtroAttivo() === 'tutti') {
      return this.posts();
    }
    return this.posts().filter(p => p.tipo === this.filtroAttivo());
  }
  
  // Like post
  likePost(postId: number) {
    this.posts.update(posts => 
      posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  }
  
  // Apri form nuovo post
  apriFormPost() {
    this.isCreatingPost.set(true);
  }
  
  // Chiudi form
  chiudiFormPost() {
    this.isCreatingPost.set(false);
    this.nuovoPost.set({
      contenuto: '',
      tipo: 'motivazione',
      tags: []
    });
  }
  
  // Pubblica post
  pubblicaPost() {
    const post = this.nuovoPost();
    if (post.contenuto.trim()) {
      const nuovoPost: Post = {
        id: Date.now(),
        autore: 'Tu',
        avatar: '😊',
        contenuto: post.contenuto,
        tipo: post.tipo,
        likes: 0,
        commenti: 0,
        data: new Date(),
        tags: post.tags
      };
      
      this.posts.update(posts => [nuovoPost, ...posts]);
      this.chiudiFormPost();
    }
  }
  
  // Cambia filtro
  setFiltro(filtro: 'tutti' | 'obiettivo' | 'successo' | 'motivazione' | 'domanda') {
    this.filtroAttivo.set(filtro);
  }
  
  // Ottieni icona per tipo
  getIconaTipo(tipo: string): string {
    const icone: { [key: string]: string } = {
      'obiettivo': '🎯',
      'successo': '🎉',
      'motivazione': '💪',
      'domanda': '❓'
    };
    return icone[tipo] || '📝';
  }
  
  // Formatta data relativa
  formatDataRelativa(data: Date): string {
    const ora = new Date(data);
    const adesso = new Date();
    const diff = Math.floor((adesso.getTime() - ora.getTime()) / 1000);
    
    if (diff < 60) return 'Proprio ora';
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} giorni fa`;
    
    return ora.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  }
}
