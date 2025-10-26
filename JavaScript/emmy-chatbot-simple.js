/* Emmy the Dove Chatbot - Simple JavaScript Version */
class EmmyDove {
    constructor() {
        this.messages = [];
        this.userProfile = {
            age: null,
            name: null,
            points: 0,
            level: 1,
            completedChallenges: [],
            conversationCount: 0
        };
        this.isListening = false;
        this.isSpeaking = false;
        this.isTyping = false;
        this.soundEnabled = true;
        this.selectedLanguage = 'en';
        this.recognition = null;
        this.init();
    }

    init() {
        this.loadConversationHistory();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        
        // Initial greeting
        setTimeout(() => {
            this.addEmmyMessage("Hi there! 🕊️ I'm Emmy the Dove! I'm here to chat with you about kindness, respect, and staying safe. How old are you?");
        }, 1000);
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('send-btn');
        const inputField = document.getElementById('input-field');
        const voiceBtn = document.getElementById('voice-btn');

        sendBtn?.addEventListener('click', () => this.handleSendMessage());
        inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
        voiceBtn?.addEventListener('click', () => this.toggleListening());

        // Settings buttons
        document.getElementById('sound-toggle')?.addEventListener('click', () => this.toggleSound());
        document.getElementById('clear-history')?.addEventListener('click', () => this.clearHistory());
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('input-field').value = transcript;
                this.isListening = false;
                this.updateVoiceButton();
            };

            this.recognition.onerror = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };
        }
    }

    addMessage(sender, text, image = null, isPoints = false) {
        const message = {
            id: Date.now(),
            sender,
            text,
            image,
            isPoints,
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
        this.saveConversationHistory();
        return message;
    }

    addEmmyMessage(text, image = null) {
        const message = this.addMessage('emmy', text, image);
        if (this.soundEnabled) {
            setTimeout(() => this.speakText(text), 500);
        }
        return message;
    }

    addPointsMessage(points) {
        const text = `🎉 Amazing! You earned ${points} points!`;
        this.addMessage('emmy', text, null, true);
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender} ${message.isPoints ? 'points' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = message.sender === 'emmy' ? '🕊️' : message.isPoints ? '🎉' : '👤';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message.text;

        if (message.image) {
            const img = document.createElement('img');
            img.src = message.image;
            img.className = 'message-image';
            img.alt = 'Generated illustration';
            bubble.appendChild(img);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
    }

    handleSendMessage() {
        const inputField = document.getElementById('input-field');
        const text = inputField?.value.trim();
        
        if (!text) return;

        this.addMessage('user', text);
        this.userProfile.conversationCount++;
        inputField.value = '';
        
        this.generateEmmyResponse(text);
    }

    generateEmmyResponse(userMessage) {
        this.showTypingIndicator();

        // Analyze user input
        const detectedAge = this.analyzeUserInput(userMessage);
        const detectedName = this.extractName(userMessage);

        // Update user profile
        if (detectedAge && !this.userProfile.age) {
            this.userProfile.age = detectedAge;
            this.updatePointsDisplay();
        }
        if (detectedName && !this.userProfile.name) {
            this.userProfile.name = detectedName;
        }

        // Generate response
        const ageGroup = this.getAgeGroup(this.userProfile.age || 9);
        let response = this.generateAgeAppropriateResponse(userMessage, ageGroup);

        // Personalize with name
        if (this.userProfile.name) {
            response = response.replace(/\b(you|sweetie|there)\b/gi, this.userProfile.name);
        }

        setTimeout(() => {
            this.hideTypingIndicator();
            this.addEmmyMessage(response);
            
            // Random points award
            if (Math.random() < 0.3) {
                const points = Math.floor(Math.random() * 15) + 5;
                this.awardPoints(points);
            }
        }, 1000 + Math.random() * 2000);
    }

    generateAgeAppropriateResponse(message, ageGroup) {
        const lowerMessage = message.toLowerCase();

        // Age detection responses
        if (lowerMessage.match(/\b(\d+)\b/) && !this.userProfile.age) {
            const age = parseInt(lowerMessage.match(/\b(\d+)\b/)[0]);
            if (age >= 3 && age <= 14) {
                this.userProfile.age = age;
                return `Great! ${age} is a wonderful age! 🌟 I'm so excited to chat with you and help you learn about kindness and respect!`;
            }
        }

        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            if (ageGroup <= 5) {
                return "Hi sweetie! 🌟 I'm Emmy! Want to play and learn together?";
            } else if (ageGroup <= 8) {
                return "Hey there! 🦸 I'm Emmy! Ready for some awesome adventures?";
            } else if (ageGroup <= 11) {
                return "Hi! 🎮 I'm Emmy! Let's explore some really important topics together!";
            } else {
                return "Hey! 💭 I'm Emmy. Let's talk about the things that really matter.";
            }
        }

        // Age-specific responses
        if (ageGroup <= 5) {
            if (lowerMessage.includes('share') || lowerMessage.includes('kind')) {
                return "Sharing is so wonderful! 🌟 When we share, everyone feels happy! Can you tell me about a time you shared something?";
            }
            if (lowerMessage.includes('color')) {
                return "Colors are amazing! 🎨 What's your favorite color? I love all the pretty colors in the rainbow!";
            }
            return "You're so smart! 🎨 Keep asking questions! What would you like to learn about?";
        } else if (ageGroup <= 8) {
            if (lowerMessage.includes('bully') || lowerMessage.includes('mean')) {
                return "Being mean isn't okay! 🦸 Real heroes stand up for others and ask grown-ups for help. You can be a hero too!";
            }
            if (lowerMessage.includes('friend')) {
                return "Friends are special! 👥 Good friends are kind, share, and include everyone. What makes someone a good friend to you?";
            }
            return "That's fantastic thinking! 💡 You're learning so much! Tell me more about what you're thinking!";
        } else if (ageGroup <= 11) {
            if (lowerMessage.includes('boundary') || lowerMessage.includes('space')) {
                return "Boundaries are like invisible fences that keep us safe! 🎯 Everyone has the right to say 'no' and have their space respected. What boundaries are important to you?";
            }
            if (lowerMessage.includes('feeling') || lowerMessage.includes('emotion')) {
                return "Feelings are important messages from our hearts! 💭 It's okay to feel angry, sad, happy, or confused. What are you feeling right now?";
            }
            return "That's really insightful! 🧠 You're thinking deeply about this! What else would you like to explore?";
        } else {
            if (lowerMessage.includes('relationship')) {
                return "Healthy relationships are built on respect, trust, and communication! 🎭 Both people should feel safe, valued, and free to be themselves. What do you think makes a relationship healthy?";
            }
            if (lowerMessage.includes('consent')) {
                return "Consent means getting a clear 'yes' before doing something that affects another person. 💪 It's about respecting everyone's choices and boundaries. This applies to everything from borrowing something to physical contact.";
            }
            return "That shows real wisdom! 🎯 Keep developing those critical thinking skills! What's your perspective on this?";
        }
    }

    analyzeUserInput(text) {
        const ageKeywords = {
            3: ['tiny', 'baby', 'mommy', 'daddy', 'play', 'colors', 'toys', 'doll', 'teddy'],
            6: ['school', 'friend', 'games', 'cool', 'awesome', 'teacher', 'homework', 'recess'],
            9: ['think', 'why', 'understand', 'feelings', 'fair', 'unfair', 'middle school'],
            12: ['relationship', 'serious', 'consent', 'respect', 'identity', 'responsibility']
        };

        const lowerText = text.toLowerCase();
        for (const [age, keywords] of Object.entries(ageKeywords)) {
            const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
            if (matchCount >= 1) {
                return parseInt(age);
            }
        }
        return null;
    }

    extractName(text) {
        const nameMatch = text.match(/i'?m\s+(.+)|name\s+is\s+(.+)|call\s+me\s+(.+)/i);
        if (nameMatch) {
            const name = (nameMatch[1] || nameMatch[2] || nameMatch[3]).split(' ')[0];
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
        return null;
    }

    getAgeGroup(age) {
        if (age <= 5) return 3;
        if (age <= 8) return 6;
        if (age <= 11) return 9;
        return 12;
    }

    awardPoints(points) {
        this.userProfile.points += points;
        this.userProfile.level = Math.floor(this.userProfile.points / 100) + 1;
        setTimeout(() => this.addPointsMessage(points), 500);
        this.updatePointsDisplay();
    }

    updatePointsDisplay() {
        const pointsDisplay = document.getElementById('points-display');
        if (pointsDisplay) {
            pointsDisplay.textContent = `🏆 ${this.userProfile.points} - Level ${this.userProfile.level}`;
        }
    }

    speakText(text) {
        if (!this.soundEnabled || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = this.userProfile.age && this.userProfile.age <= 8 ? 1.2 : 1.0;
        utterance.volume = 1;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.showSpeakingIndicator();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.hideSpeakingIndicator();
        };

        window.speechSynthesis.speak(utterance);
    }

    toggleListening() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            this.recognition.start();
            this.isListening = true;
        }
        this.updateVoiceButton();
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.toggle('listening', this.isListening);
            voiceBtn.title = this.isListening ? 'Listening...' : 'Voice Input';
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            soundBtn.title = this.soundEnabled ? 'Sound On' : 'Sound Off';
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    showSpeakingIndicator() {
        const indicator = document.getElementById('speaking-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideSpeakingIndicator() {
        const indicator = document.getElementById('speaking-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('emmy-conversations');
            if (saved) {
                const data = JSON.parse(saved);
                this.messages = data.messages || [];
                this.userProfile = { ...this.userProfile, ...data.profile };
                
                // Re-render messages
                this.messages.forEach(message => this.renderMessage(message));
                this.updatePointsDisplay();
            }
        } catch (error) {
            console.log('First time user - initializing');
        }
    }

    saveConversationHistory() {
        const data = {
            messages: this.messages,
            profile: this.userProfile,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('emmy-conversations', JSON.stringify(data));
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all conversation history?')) {
            this.messages = [];
            this.userProfile = {
                age: null,
                name: null,
                points: 0,
                level: 1,
                completedChallenges: [],
                conversationCount: 0
            };
            localStorage.removeItem('emmy-conversations');
            
            const container = document.getElementById('messages-container');
            if (container) {
                container.innerHTML = '';
            }
            
            this.updatePointsDisplay();
            this.addEmmyMessage("Hi there! 🕊️ I'm Emmy the Dove! How old are you?");
        }
    }
}

// Initialize Emmy when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.emmy = new EmmyDove();
});