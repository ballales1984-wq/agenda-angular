import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';
import { LanguageService } from './services/language';
import { ChatInterface } from './components/chat-interface/chat-interface';
import { CalendarView } from './components/calendar-view/calendar-view';
import { DiaryBook } from './components/diary-book/diary-book';
import { StatsDashboard } from './components/stats-dashboard/stats-dashboard';
import { CommunityFeed } from './components/community-feed/community-feed';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ChatInterface, CalendarView, DiaryBook, StatsDashboard, CommunityFeed, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Vista attiva
  activeView = signal<'chat' | 'calendar' | 'diary' | 'stats' | 'community'>('chat');
  
  constructor(
    public themeService: ThemeService,
    public langService: LanguageService
  ) {}
  
  // Cambia vista
  setView(view: 'chat' | 'calendar' | 'diary' | 'stats' | 'community') {
    this.activeView.set(view);
  }
}
