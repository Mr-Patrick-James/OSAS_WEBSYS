/**
 * OSAS Chatbot - Hybrid System (Rule-based + AI Fallback)
 * Handles user interactions with the chatbot widget
 */

class OSASChatbot {
  constructor() {
    this.isOpen = false;
    this.messageHistory = [];
    this.apiPath = this.detectApiPath();
    this.abortController = null;
    
    this.init();
  }

  detectApiPath() {
    // Detect the correct API path based on current location
    const path = window.location.pathname;
    const basePath = window.location.origin;
    
    if (path.includes('/includes/')) {
      return '../api/chatbot.php';
    } else if (path.includes('/pages/')) {
      return '../../api/chatbot.php';
    } else if (path.includes('/admin_page/') || path.includes('/user-page/')) {
      return '../../api/chatbot.php';
    } else {
      // Try to detect from current URL structure
      const pathParts = path.split('/').filter(p => p);
      if (pathParts.length > 0 && (pathParts[0] === 'OSAS_WEBSYS' || pathParts[0] === 'osas')) {
        return 'api/chatbot.php';
      }
      return '../api/chatbot.php';
    }
  }

  init() {
    this.createChatbotInline();
    this.attachEventListeners();
    this.loadHistory();
  }

  createChatbotInline() {
    // Create chatbot HTML structure inline
    const chatbotHTML = `
      <div id="osas-chatbot" class="chatbot-widget">
        <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chatbot">
          <i class='bx bx-message-rounded'></i>
        </button>
        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <i class='bx bx-bot'></i>
              <div>
                <h3>OSAS Assistant</h3>
                <span class="chatbot-status">Online</span>
              </div>
            </div>
            <button id="chatbot-close" class="chatbot-close" aria-label="Close chatbot">
              <i class='bx bx-x'></i>
            </button>
          </div>
          <div id="chatbot-messages" class="chatbot-messages">
            <div class="chatbot-message bot-message">
              <div class="message-avatar">
                <i class='bx bx-bot'></i>
              </div>
              <div class="message-content">
                <p>Hello! I'm your OSAS Assistant. How can I help you today?</p>
              </div>
            </div>
          </div>
          <div id="chatbot-quick-actions" class="chatbot-quick-actions">
            <button class="quick-action-btn" data-action="students">View Students</button>
            <button class="quick-action-btn" data-action="violations">Check Violations</button>
            <button class="quick-action-btn" data-action="help">Get Help</button>
          </div>
          <div id="chatbot-typing" class="chatbot-typing" style="display: none;">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="chatbot-input-container">
            <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Type your message..." maxlength="500">
            <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
              <i class='bx bx-send'></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert chatbot into body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chatbotHTML;
    document.body.appendChild(tempDiv.firstElementChild);
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const quickActions = document.querySelectorAll('.quick-action-btn');

    if (toggle) toggle.addEventListener('click', () => this.toggleChat());
    if (close) close.addEventListener('click', () => this.closeChat());
    if (send) send.addEventListener('click', () => this.sendMessage());
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    quickActions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (window) {
      window.classList.toggle('active', this.isOpen);
      if (this.isOpen) {
        const input = document.getElementById('chatbot-input');
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
        // Scroll to bottom when opening
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
          setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }, 300);
        }
      }
    }
    
    // Update toggle button state
    if (toggle) {
      toggle.setAttribute('aria-label', this.isOpen ? 'Close chatbot' : 'Open chatbot');
    }
  }

  closeChat() {
    this.isOpen = false;
    const window = document.getElementById('chatbot-window');
    if (window) window.classList.remove('active');
  }

  handleQuickAction(action) {
    const messages = {
      students: 'How many students are in the system?',
      violations: 'Show me recent violations',
      help: 'I need help with the OSAS system'
    };

    const message = messages[action] || 'Help me';
    const input = document.getElementById('chatbot-input');
    if (input) {
      input.value = message;
      this.sendMessage();
    }
  }

  sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    if (!input || !sendBtn) return;

    const message = input.value.trim();
    if (!message) return;

    // Validate message length
    if (message.length > 500) {
      this.addMessage('bot', 'Message is too long. Please keep it under 500 characters.');
      return;
    }

    // Disable input and send button
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');

    // Add user message
    this.addMessage('user', message);
    input.value = '';

    // Show typing indicator
    this.showTyping();

    // Cancel any pending requests
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: this.messageHistory.slice(-10) // Last 10 messages for better context
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format response (preserve line breaks)
        const formattedResponse = data.response.replace(/\n/g, '<br>');
        this.addMessage('bot', formattedResponse, true);
        this.messageHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: data.response }
        );
        this.saveHistory();
      } else {
        this.addMessage('bot', data.error || 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled
      }
      console.error('Chatbot error:', error);
      this.addMessage('bot', 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.');
    } finally {
      this.hideTyping();
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.classList.remove('loading');
      input.focus();
      this.abortController = null;
    }
  }

  addMessage(type, content, isHTML = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'bot' ? '<i class=\'bx bx-bot\'></i>' : '<i class=\'bx bx-user\'></i>';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    const p = document.createElement('p');
    
    if (isHTML) {
      p.innerHTML = content;
    } else {
      p.textContent = content;
    }
    
    messageContent.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom with smooth animation
    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }

  showTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.style.display = 'block';
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.style.display = 'none';
  }

  saveHistory() {
    try {
      localStorage.setItem('osas_chatbot_history', JSON.stringify(this.messageHistory));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('osas_chatbot_history');
      if (saved) {
        this.messageHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load chat history:', e);
      this.messageHistory = [];
    }
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.osasChatbot = new OSASChatbot();
  });
} else {
  window.osasChatbot = new OSASChatbot();
}
