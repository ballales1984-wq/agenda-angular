import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ToastService } from '../../services/toast';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-obiettivi-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './obiettivi-manager.html',
  styleUrl: './obiettivi-manager.css',
})
export class ObiettiviManager {
  // Form nuovo obiettivo
  isCreating = signal(false);
  nuovoObiettivo = signal({
    titolo: '',
    descrizione: '',
    categoria: 'studio' as 'studio' | 'lavoro' | 'salute' | 'personale',
    frequenza: 'settimanale' as 'giornaliero' | 'settimanale' | 'mensile',
    ore_necessarie: 10
  });
  
  constructor(
    public apiService: ApiService,
    public langService: LanguageService,
    private toastService: ToastService
  ) {}
  
  // Apri form
  apriForm() {
    this.isCreating.set(true);
  }
  
  // Chiudi form
  chiudiForm() {
    this.isCreating.set(false);
    this.resetForm();
  }
  
  // Reset form
  resetForm() {
    this.nuovoObiettivo.set({
      titolo: '',
      descrizione: '',
      categoria: 'studio',
      frequenza: 'settimanale',
      ore_necessarie: 10
    });
  }
  
  // Crea obiettivo
  creaObiettivo() {
    const ob = this.nuovoObiettivo();
    
    if (!ob.titolo.trim()) {
      this.toastService.warning('Inserisci un titolo per l\'obiettivo!');
      return;
    }
    
    const obiettivo = {
      id: Date.now(),
      titolo: ob.titolo,
      descrizione: ob.descrizione,
      categoria: ob.categoria,
      frequenza: ob.frequenza,
      ore_necessarie: ob.ore_necessarie,
      ore_completate: 0,
      progresso: 0,
      data_inizio: new Date(),
      completato: false
    };
    
    this.apiService.obiettivi.update(obiettivi => [...obiettivi, obiettivo]);
    this.toastService.success(`✅ Obiettivo "${ob.titolo}" creato!`);
    this.chiudiForm();
  }
  
  // Aggiorna progresso
  aggiornaProgresso(id: number, ore: number) {
    this.apiService.obiettivi.update(obiettivi =>
      obiettivi.map(ob => {
        if (ob.id === id) {
          const nuoveOre = Math.min(ob.ore_completate + ore, ob.ore_necessarie);
          const progresso = Math.round((nuoveOre / ob.ore_necessarie) * 100);
          return {
            ...ob,
            ore_completate: nuoveOre,
            progresso: progresso,
            completato: progresso >= 100
          };
        }
        return ob;
      })
    );
    
    this.toastService.success(`+${ore}h aggiunte!`);
  }
  
  // Elimina obiettivo
  eliminaObiettivo(id: number) {
    const ob = this.apiService.obiettivi().find(o => o.id === id);
    this.apiService.obiettivi.update(obiettivi => obiettivi.filter(o => o.id !== id));
    
    if (ob) {
      this.toastService.info(`Obiettivo "${ob.titolo}" eliminato`);
    }
  }
  
  // Ottieni icona categoria
  getIconaCategoria(categoria: string): string {
    const icone: { [key: string]: string } = {
      'studio': '📚',
      'lavoro': '💼',
      'salute': '💪',
      'personale': '🎯'
    };
    return icone[categoria] || '🎯';
  }
  
  // Ottieni colore categoria
  getColoreCategoria(categoria: string): string {
    const colori: { [key: string]: string } = {
      'studio': '#8b5cf6',
      'lavoro': '#3b82f6',
      'salute': '#10b981',
      'personale': '#ec4899'
    };
    return colori[categoria] || '#667eea';
  }
}
