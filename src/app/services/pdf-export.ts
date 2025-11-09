import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { DiarioEntry } from '../models/diario-entry';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  exportDiario(entries: DiarioEntry[], title: string = 'Il Mio Diario') {
    const doc = new jsPDF();
    
    // Configurazione
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Titolo
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 30, { align: 'center' });
    
    // Sottotitolo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const today = new Date().toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Esportato il ${today}`, pageWidth / 2, 40, { align: 'center' });
    
    // Linea separatrice
    doc.setLineWidth(0.5);
    doc.line(margin, 45, pageWidth - margin, 45);
    
    let yPosition = 60;
    
    // Ordina entries per data (più recenti prima)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    
    sortedEntries.forEach((entry, index) => {
      // Nuova pagina se necessario
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Data
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234); // Colore viola
      const dataString = new Date(entry.data).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      doc.text(dataString, margin, yPosition);
      
      // Emoji umore
      const moodEmoji = this.getMoodEmoji(entry.umore);
      doc.setFontSize(12);
      doc.text(moodEmoji, pageWidth - margin - 10, yPosition);
      
      yPosition += 8;
      
      // Linea sotto la data
      doc.setLineWidth(0.3);
      doc.setDrawColor(200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      
      yPosition += 10;
      
      // Contenuto
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(44, 62, 80); // Colore testo scuro
      
      const lines = doc.splitTextToSize(entry.contenuto, maxWidth);
      doc.text(lines, margin, yPosition);
      
      yPosition += lines.length * 6;
      
      // Tags se presenti
      if (entry.tags && entry.tags.length > 0) {
        yPosition += 5;
        doc.setFontSize(9);
        doc.setTextColor(102, 126, 234);
        const tagsText = entry.tags.map(t => `#${t}`).join(' ');
        doc.text(tagsText, margin, yPosition);
        yPosition += 6;
      }
      
      yPosition += 15; // Spazio tra entries
    });
    
    // Footer su ogni pagina
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Pagina ${i} di ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Salva PDF
    const filename = `Diario_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  }
  
  private getMoodEmoji(mood: string): string {
    const moods: { [key: string]: string } = {
      'felice': '😊',
      'neutro': '😐',
      'triste': '😢',
      'motivato': '💪',
      'stressato': '😰'
    };
    return moods[mood] || '😐';
  }
}
