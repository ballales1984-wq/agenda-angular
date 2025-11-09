import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  // Verifica se gtag è disponibile
  private isGtagAvailable(): boolean {
    return typeof gtag !== 'undefined';
  }
  
  // Track page view
  trackPageView(pageName: string, pageUrl?: string) {
    if (this.isGtagAvailable()) {
      gtag('event', 'page_view', {
        page_title: pageName,
        page_location: pageUrl || window.location.href,
        page_path: window.location.pathname
      });
    }
  }
  
  // Track eventi personalizzati
  trackEvent(eventName: string, eventParams?: any) {
    if (this.isGtagAvailable()) {
      gtag('event', eventName, eventParams);
    }
  }
  
  // Eventi specifici dell'app
  
  trackChatMessage(messageType: 'user' | 'assistant') {
    this.trackEvent('chat_message', {
      message_type: messageType
    });
  }
  
  trackVoiceInput() {
    this.trackEvent('voice_input_used', {
      feature: 'speech_to_text'
    });
  }
  
  trackVoiceOutput() {
    this.trackEvent('voice_output_used', {
      feature: 'text_to_speech'
    });
  }
  
  trackDiaryPageTurn(method: 'swipe' | 'scroll' | 'button') {
    this.trackEvent('diary_page_turn', {
      navigation_method: method
    });
  }
  
  trackDiaryRead() {
    this.trackEvent('diary_read_aloud', {
      feature: 'tts_diary'
    });
  }
  
  trackPDFExport(type: string) {
    this.trackEvent('pdf_export', {
      export_type: type
    });
  }
  
  trackPomodoroStart() {
    this.trackEvent('pomodoro_started');
  }
  
  trackPomodoroComplete() {
    this.trackEvent('pomodoro_completed');
  }
  
  trackHabitToggle(habitName: string) {
    this.trackEvent('habit_toggle', {
      habit_name: habitName
    });
  }
  
  trackCommunityPost(postType: string) {
    this.trackEvent('community_post_created', {
      post_type: postType
    });
  }
  
  trackCommunityLike() {
    this.trackEvent('community_like');
  }
  
  trackThemeToggle(theme: 'dark' | 'light') {
    this.trackEvent('theme_changed', {
      theme: theme
    });
  }
  
  trackLanguageChange(language: 'it' | 'en') {
    this.trackEvent('language_changed', {
      language: language
    });
  }
  
  trackSearch(query: string, resultsCount: number) {
    this.trackEvent('search_performed', {
      search_query: query,
      results_count: resultsCount
    });
  }
}
