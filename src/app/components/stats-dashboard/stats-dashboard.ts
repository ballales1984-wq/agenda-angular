import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-stats-dashboard',
  imports: [CommonModule],
  templateUrl: './stats-dashboard.html',
  styleUrl: './stats-dashboard.css',
})
export class StatsDashboard {
  constructor(public apiService: ApiService) {}
  
  // Statistiche computed
  totalImpegni = computed(() => this.apiService.impegni().length);
  impegniCompletati = computed(() => 
    this.apiService.impegni().filter(i => i.completato).length
  );
  
  totalObiettivi = computed(() => this.apiService.obiettivi().length);
  obiettiviCompletati = computed(() => 
    this.apiService.obiettivi().filter(o => o.completato).length
  );
  
  totalSpese = computed(() => this.apiService.spese().length);
  sommaSpese = computed(() => 
    this.apiService.spese().reduce((sum, s) => sum + s.importo, 0)
  );
  
  entriesDiario = computed(() => this.apiService.diario().length);
  
  // Percentuali
  percentualeImpegni = computed(() => {
    const total = this.totalImpegni();
    return total > 0 ? Math.round((this.impegniCompletati() / total) * 100) : 0;
  });
  
  percentualeObiettivi = computed(() => {
    const total = this.totalObiettivi();
    return total > 0 ? Math.round((this.obiettiviCompletati() / total) * 100) : 0;
  });
}
