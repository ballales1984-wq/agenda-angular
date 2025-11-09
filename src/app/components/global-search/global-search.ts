import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

interface SearchResult {
  type: 'impegno' | 'diario' | 'obiettivo' | 'post';
  id: number;
  title: string;
  content: string;
  date?: Date;
  icon: string;
}

@Component({
  selector: 'app-global-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search.html',
  styleUrl: './global-search.css',
})
export class GlobalSearch {
  searchQuery = signal('');
  isOpen = signal(false);
  
  constructor(public apiService: ApiService) {}
  
  // Risultati della ricerca
  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) return [];
    
    const results: SearchResult[] = [];
    
    // Cerca negli impegni
    this.apiService.impegni().forEach(imp => {
      if (imp.titolo.toLowerCase().includes(query) || 
          imp.descrizione?.toLowerCase().includes(query)) {
        results.push({
          type: 'impegno',
          id: imp.id!,
          title: imp.titolo,
          content: imp.descrizione || '',
          date: imp.data,
          icon: '📅'
        });
      }
    });
    
    // Cerca nel diario
    this.apiService.diario().forEach(entry => {
      if (entry.contenuto.toLowerCase().includes(query)) {
        results.push({
          type: 'diario',
          id: entry.id!,
          title: 'Diario ' + new Date(entry.data).toLocaleDateString('it-IT'),
          content: entry.contenuto.substring(0, 100) + '...',
          date: entry.data,
          icon: '📖'
        });
      }
    });
    
    // Cerca negli obiettivi
    this.apiService.obiettivi().forEach(ob => {
      if (ob.titolo.toLowerCase().includes(query) || 
          ob.descrizione?.toLowerCase().includes(query)) {
        results.push({
          type: 'obiettivo',
          id: ob.id!,
          title: ob.titolo,
          content: ob.descrizione || '',
          icon: '🎯'
        });
      }
    });
    
    return results;
  });
  
  // Toggle search overlay
  toggle() {
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.searchQuery.set('');
    }
  }
  
  // Close overlay
  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
  }
  
  // Formatta tipo
  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'impegno': 'Impegno',
      'diario': 'Diario',
      'obiettivo': 'Obiettivo',
      'post': 'Post'
    };
    return labels[type] || type;
  }
}
