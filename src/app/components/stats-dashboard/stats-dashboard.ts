import { Component, computed, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-stats-dashboard',
  imports: [CommonModule],
  templateUrl: './stats-dashboard.html',
  styleUrl: './stats-dashboard.css',
})
export class StatsDashboard implements AfterViewInit, OnDestroy {
  private charts: Chart[] = [];
  
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
  
  ngAfterViewInit() {
    // Aspetta che il DOM sia pronto
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }
  
  ngOnDestroy() {
    // Distruggi i grafici quando il componente viene distrutto
    this.charts.forEach(chart => chart.destroy());
  }
  
  private createCharts() {
    this.createImpegniChart();
    this.createSpeseChart();
  }
  
  private createImpegniChart() {
    const canvas = document.getElementById('impegniChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completati', 'Da fare'],
        datasets: [{
          data: [this.impegniCompletati(), this.totalImpegni() - this.impegniCompletati()],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.3)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    
    this.charts.push(chart);
  }
  
  private createSpeseChart() {
    const canvas = document.getElementById('speseChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Raggruppa spese per categoria
    const spese = this.apiService.spese();
    const categories = ['cibo', 'trasporti', 'intrattenimento', 'salute', 'altro'];
    const data = categories.map(cat => 
      spese.filter(s => s.categoria === cat).reduce((sum, s) => sum + s.importo, 0)
    );
    
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['🍕 Cibo', '🚗 Trasporti', '🎬 Svago', '💊 Salute', '📦 Altro'],
        datasets: [{
          label: 'Spese (€)',
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(107, 114, 128, 0.8)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '€' + value
            }
          }
        }
      }
    });
    
    this.charts.push(chart);
  }
}
