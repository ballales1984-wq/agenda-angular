import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';

interface Insight {
  icona: string;
  titolo: string;
  descrizione: string;
  tipo: 'positivo' | 'neutro' | 'attenzione';
  azione?: string;
}

@Component({
  selector: 'app-smart-insights',
  imports: [CommonModule],
  templateUrl: './smart-insights.html',
  styleUrl: './smart-insights.css',
})
export class SmartInsights {
  constructor(
    public apiService: ApiService,
    public langService: LanguageService
  ) {}

  // GENERA INSIGHTS INTELLIGENTI
  insights = computed(() => {
    const insights: Insight[] = [];
    
    // Analizza diario
    const diario = this.apiService.diario();
    const impegni = this.apiService.impegni();
    const obiettivi = this.apiService.obiettivi();
    
    // INSIGHT 1: Frequenza scrittura diario
    if (diario.length > 0) {
      const ultimi7giorni = diario.filter(d => {
        const diff = Date.now() - new Date(d.data).getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      });
      
      if (ultimi7giorni.length >= 5) {
        insights.push({
          icona: '🔥',
          titolo: 'Costanza nel Diario',
          descrizione: `Hai scritto ${ultimi7giorni.length} volte questa settimana! Ottima abitudine!`,
          tipo: 'positivo',
          azione: 'Continua così!'
        });
      } else if (ultimi7giorni.length === 0) {
        insights.push({
          icona: '📝',
          titolo: 'Diario Trascurato',
          descrizione: 'Non scrivi da più di 7 giorni. Il diario ti aiuta a riflettere!',
          tipo: 'attenzione',
          azione: 'Vai su Diario e scrivi oggi'
        });
      }
      
      // Pattern orario scrittura
      const orari = diario.map(d => new Date(d.data).getHours());
      const oraMattina = orari.filter(h => h < 12).length;
      const oraSera = orari.filter(h => h >= 18).length;
      
      if (oraMattina > diario.length * 0.6) {
        insights.push({
          icona: '🌅',
          titolo: 'Persona Mattiniera',
          descrizione: 'Scrivi principalmente di mattina. Il tuo momento di riflessione!',
          tipo: 'neutro'
        });
      } else if (oraSera > diario.length * 0.6) {
        insights.push({
          icona: '🌙',
          titolo: 'Riflessione Serale',
          descrizione: 'Scrivi principalmente di sera. Ottimo modo per chiudere la giornata!',
          tipo: 'positivo'
        });
      }
      
      // Pattern giorni settimana
      const giorniSett = diario.map(d => new Date(d.data).getDay());
      const lunedi = giorniSett.filter(g => g === 1).length;
      const domenica = giorniSett.filter(g => g === 0).length;
      
      if (lunedi > diario.length * 0.3) {
        insights.push({
          icona: '📅',
          titolo: 'Inizio Settimana Produttivo',
          descrizione: 'Scrivi spesso il lunedì. Usi il diario per pianificare la settimana!',
          tipo: 'positivo'
        });
      }
      
      if (domenica > diario.length * 0.25) {
        insights.push({
          icona: '🌴',
          titolo: 'Weekend Riflessivo',
          descrizione: 'La domenica è il tuo giorno di riflessione principale',
          tipo: 'neutro'
        });
      }
    }
    
    // INSIGHT 2: Impegni e produttività
    if (impegni.length > 0) {
      const completati = impegni.filter(i => i.completato).length;
      const percCompletamento = Math.round((completati / impegni.length) * 100);
      
      if (percCompletamento >= 80) {
        insights.push({
          icona: '🏆',
          titolo: 'Super Produttivo!',
          descrizione: `Completi il ${percCompletamento}% dei tuoi impegni. Sei un campione!`,
          tipo: 'positivo',
          azione: 'Mantieni questo ritmo!'
        });
      } else if (percCompletamento < 50) {
        insights.push({
          icona: '⚠️',
          titolo: 'Troppe Cose in Ballo',
          descrizione: `Completi solo il ${percCompletamento}% degli impegni. Forse ne stai pianificando troppi?`,
          tipo: 'attenzione',
          azione: 'Riduci il carico o usa il Pomodoro per focus'
        });
      }
      
      // Categoria più frequente
      const categorie = impegni.map(i => i.categoria);
      const catCount: { [key: string]: number } = {};
      categorie.forEach(c => catCount[c] = (catCount[c] || 0) + 1);
      const catPrevalente = Object.entries(catCount).reduce((prev, curr) => 
        curr[1] > prev[1] ? curr : prev
      );
      
      insights.push({
        icona: this.getIconaCategoria(catPrevalente[0]),
        titolo: 'Focus Principale',
        descrizione: `La tua categoria più frequente è "${catPrevalente[0]}" (${catPrevalente[1]} impegni)`,
        tipo: 'neutro'
      });
    }
    
    // INSIGHT 3: Obiettivi
    if (obiettivi.length > 0) {
      const inCorso = obiettivi.filter(o => !o.completato && o.progresso > 0);
      
      if (inCorso.length > 5) {
        insights.push({
          icona: '🎯',
          titolo: 'Troppi Obiettivi Simultanei',
          descrizione: `Hai ${inCorso.length} obiettivi in corso. Focus su 2-3 per massimi risultati!`,
          tipo: 'attenzione',
          azione: 'Completa prima di aggiungere altri'
        });
      }
      
      // Obiettivo vicino al completamento
      const quasiCompleto = obiettivi.find(o => o.progresso >= 80 && !o.completato);
      if (quasiCompleto) {
        insights.push({
          icona: '🎉',
          titolo: 'Quasi Arrivato!',
          descrizione: `"${quasiCompleto.titolo}" è al ${quasiCompleto.progresso}%! Un ultimo sforzo!`,
          tipo: 'positivo',
          azione: 'Aggiungi ore per completare'
        });
      }
      
      // Obiettivo fermo
      const fermo = obiettivi.find(o => !o.completato && o.progresso < 20 && 
        Date.now() - new Date(o.data_inizio).getTime() > 7 * 24 * 60 * 60 * 1000);
      if (fermo) {
        insights.push({
          icona: '😴',
          titolo: 'Obiettivo Dimenticato',
          descrizione: `"${fermo.titolo}" è fermo da più di 7 giorni. Riprendilo o eliminalo!`,
          tipo: 'attenzione',
          azione: 'Riattiva o elimina'
        });
      }
    }
    
    // INSIGHT 4: Correlazione umore-attività
    if (diario.length >= 10 && impegni.length >= 5) {
      const giorniConSport = new Set(
        impegni.filter(i => i.categoria === 'sport')
          .map(i => new Date(i.data).toDateString())
      );
      
      const umoreConSport = diario.filter(d => 
        giorniConSport.has(new Date(d.data).toDateString())
      );
      
      if (umoreConSport.length >= 3) {
        const avgUmoreSport = umoreConSport.reduce((sum, d) => 
          sum + this.moodToScore(d.umore), 0) / umoreConSport.length;
        
        const avgUmoreGenerale = diario.reduce((sum, d) => 
          sum + this.moodToScore(d.umore), 0) / diario.length;
        
        if (avgUmoreSport > avgUmoreGenerale + 0.5) {
          insights.push({
            icona: '💪',
            titolo: 'Sport = Felicità',
            descrizione: 'Nei giorni in cui fai sport, il tuo umore è significativamente migliore!',
            tipo: 'positivo',
            azione: 'Aggiungi più sessioni di sport'
          });
        }
      }
    }
    
    // INSIGHT 5: Suggerimento generale
    if (insights.length === 0) {
      insights.push({
        icona: '🚀',
        titolo: 'Inizia a Tracciare!',
        descrizione: 'Usa l\'app per qualche settimana per vedere insights personalizzati!',
        tipo: 'neutro',
        azione: 'Scrivi nel diario e completa impegni'
      });
    }
    
    return insights;
  });

  // Helpers
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

  private getIconaCategoria(categoria: string): string {
    const icone: { [key: string]: string } = {
      'lavoro': '💼',
      'studio': '📚',
      'personale': '🎯',
      'sport': '⚽',
      'altro': '📌'
    };
    return icone[categoria] || '📌';
  }
}
