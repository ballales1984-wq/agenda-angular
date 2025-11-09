import { Component, computed, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MoodStats {
  umore: string;
  count: number;
  percentuale: number;
}

interface MoodTrend {
  data: Date;
  umore: string;
  score: number; // 1-5
}

@Component({
  selector: 'app-mood-analytics',
  imports: [CommonModule],
  templateUrl: './mood-analytics.html',
  styleUrl: './mood-analytics.css',
})
export class MoodAnalytics implements AfterViewInit, OnDestroy {
  private chart: Chart | null = null;

  constructor(
    public apiService: ApiService,
    public langService: LanguageService
  ) {}

  // Statistiche umore
  moodStats = computed(() => {
    const entries = this.apiService.diario();
    const stats: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      stats[entry.umore] = (stats[entry.umore] || 0) + 1;
    });
    
    const total = entries.length || 1;
    
    return Object.entries(stats).map(([umore, count]) => ({
      umore,
      count,
      percentuale: Math.round((count / total) * 100)
    }));
  });

  // Umore prevalente
  moodPrevalente = computed(() => {
    const stats = this.moodStats();
    if (stats.length === 0) return { umore: 'neutro', emoji: '😐' };
    
    const max = stats.reduce((prev, curr) => 
      curr.count > prev.count ? curr : prev
    );
    
    return {
      umore: max.umore,
      emoji: this.getMoodEmoji(max.umore),
      percentuale: max.percentuale
    };
  });

  // Trend ultimi 30 giorni
  moodTrend = computed(() => {
    const entries = this.apiService.diario();
    const ultimi30 = entries
      .filter(e => {
        const diff = Date.now() - new Date(e.data).getTime();
        return diff < 30 * 24 * 60 * 60 * 1000; // 30 giorni
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    return ultimi30.map(e => ({
      data: new Date(e.data),
      umore: e.umore,
      score: this.moodToScore(e.umore)
    }));
  });

  // Insights AI
  insights = computed(() => {
    const trend = this.moodTrend();
    const insights: string[] = [];
    
    if (trend.length < 3) {
      return ['📝 Scrivi più pagine nel diario per vedere insights AI!'];
    }
    
    // Media umore
    const avgScore = trend.reduce((sum, t) => sum + t.score, 0) / trend.length;
    
    if (avgScore >= 4) {
      insights.push('🌟 Il tuo umore è OTTIMO! Continua così!');
    } else if (avgScore >= 3) {
      insights.push('😊 Il tuo umore è positivo nella media');
    } else if (avgScore >= 2) {
      insights.push('😐 Il tuo umore è neutro. Prova più attività che ti piacciono!');
    } else {
      insights.push('💙 Ti senti giù ultimamente. Considera di parlare con qualcuno o fare più sport!');
    }
    
    // Trend crescente/decrescente
    if (trend.length >= 7) {
      const ultimi7 = trend.slice(-7);
      const primi3 = ultimi7.slice(0, 3).reduce((sum, t) => sum + t.score, 0) / 3;
      const ultimi3 = ultimi7.slice(-3).reduce((sum, t) => sum + t.score, 0) / 3;
      
      if (ultimi3 > primi3 + 0.5) {
        insights.push('📈 Il tuo umore sta MIGLIORANDO negli ultimi giorni!');
      } else if (ultimi3 < primi3 - 0.5) {
        insights.push('📉 Il tuo umore sta peggiorando. Prenditi cura di te!');
      } else {
        insights.push('➡️ Il tuo umore è stabile');
      }
    }
    
    // Giorno migliore
    const giorniUmore: { [key: number]: number[] } = {};
    trend.forEach(t => {
      const giorno = t.data.getDay();
      if (!giorniUmore[giorno]) giorniUmore[giorno] = [];
      giorniUmore[giorno].push(t.score);
    });
    
    const giorniAvg = Object.entries(giorniUmore).map(([giorno, scores]) => ({
      giorno: parseInt(giorno),
      avg: scores.reduce((sum, s) => sum + s, 0) / scores.length
    }));
    
    if (giorniAvg.length >= 3) {
      const migliore = giorniAvg.reduce((prev, curr) => curr.avg > prev.avg ? curr : prev);
      const giornoNome = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][migliore.giorno];
      insights.push(`📅 Il tuo umore è migliore il ${giornoNome}!`);
    }
    
    return insights;
  });

  ngAfterViewInit() {
    this.createMoodChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // Crea grafico umore nel tempo
  private createMoodChart() {
    const canvas = document.getElementById('moodChart') as HTMLCanvasElement;
    if (!canvas) return;

    const trend = this.moodTrend();
    
    if (trend.length === 0) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: trend.map(t => t.data.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })),
        datasets: [{
          label: 'Umore (1-5)',
          data: trend.map(t => t.score),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: trend.map(t => this.getColorByScore(t.score)),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const score = context.parsed.y;
                const moods = ['😢 Molto triste', '😔 Triste', '😐 Neutro', '😊 Felice', '😄 Molto felice'];
                return moods[score - 1] || 'Neutro';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                const moods = ['😢', '😔', '😐', '😊', '😄'];
                return moods[Number(value) - 1];
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Converti umore in score 1-5
  private moodToScore(umore: string): number {
    const scores: { [key: string]: number } = {
      'triste': 2,
      'stressato': 2,
      'neutro': 3,
      'felice': 4,
      'motivato': 5
    };
    return scores[umore] || 3;
  }

  // Colore per score
  private getColorByScore(score: number): string {
    if (score >= 4.5) return '#10b981'; // Verde
    if (score >= 3.5) return '#3b82f6'; // Blu
    if (score >= 2.5) return '#f59e0b'; // Arancione
    return '#ef4444'; // Rosso
  }

  // Emoji umore
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

  // Colore per umore
  getColorByMood(umore: string): string {
    const colors: { [key: string]: string } = {
      'felice': '#10b981',
      'motivato': '#3b82f6',
      'neutro': '#f59e0b',
      'stressato': '#f97316',
      'triste': '#ef4444'
    };
    return colors[umore] || '#f59e0b';
  }
}

