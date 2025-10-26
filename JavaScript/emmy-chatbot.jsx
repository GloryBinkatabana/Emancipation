/* Emmy the Dove Chatbot - React Component */

const { useState, useEffect, useRef } = React;

// Age-based challenges
const challenges = {
  3: [
    { id: 1, title: '🤝 Kindness Quest', description: 'Share something kind with someone', points: 10, category: 'kindness' },
    { id: 2, title: '🎨 Color Story', description: 'Tell Emmy your favorite color story', points: 5, category: 'creativity' },
    { id: 3, title: '❤️ Help a Friend', description: 'Help someone today and tell Emmy!', points: 15, category: 'empathy' }
  ],
  6: [
    { id: 1, title: '🦸 Bullying Stopper', description: 'Tell a story about stopping bullying', points: 20, category: 'courage' },
    { id: 2, title: '👥 Include Everyone', description: 'Play with someone new at school', points: 15, category: 'inclusion' },
    { id: 3, title: '🤝 Respect Challenge', description: 'Show respect to someone today', points: 25, category: 'respect' }
  ],
  9: [
    { id: 1, title: '🎯 Boundary Expert', description: 'Identify 3 healthy boundaries', points: 30, category: 'boundaries' },
    { id: 2, title: '💭 Feelings Journal', description: 'Express 5 different emotions to Emmy', points: 25, category: 'emotions' },
    { id: 3, title: '⚖️ Fairness Detective', description: 'Spot and report unfairness you see', points: 35, category: 'fairness' }
  ],
  12: [
    { id: 1, title: '💪 Peer Pressure Master', description: 'Share how you resisted peer pressure', points: 50, category: 'resilience' },
    { id: 2, title: '🎭 Healthy Relationships', description: 'Define healthy vs unhealthy relationships', points: 40, category: 'relationships' },
    { id: 3, title: '🌍 Change Maker', description: 'Create a plan to help stop gender violence', points: 60, category: 'social-impact' }
  ]
};

// Age detection keywords
const ageKeywords = {
  3: ['tiny', 'baby', 'mommy', 'daddy', 'play', 'colors', 'toys', 'doll', 'teddy', 'cartoon', 'picture', 'block', 'nursery', 'preschool', 'nap', 'bedtime', 'sharing', 'friends', 'happy'],
  6: ['school', 'friend', 'games', 'cool', 'awesome', 'first grade', 'second grade', 'recess', 'teacher', 'homework', 'bullying', 'mean kids', 'scared', 'new friends', 'sports', 'team'],
  9: ['think', 'why', 'understand', 'feelings', 'wrong', 'right', 'fair', 'unfair', 'middle school', 'peer', 'pressure', 'boundaries', 'different', 'weird', 'embarrassed', 'crush', 'groups', 'emotions', 'confused', 'decision'],
  12: ['relationship', 'serious', 'consent', 'respect', 'gender', 'identity', 'responsibility', 'consequence', 'decision', 'values', 'toxic', 'healthy', 'manipulation', 'control', 'independence', 'dating', 'mental health', 'trauma', 'safe', 'unsafe', 'sexual', 'rights']
};

// Translations
const translations = {
  en: {
    greeting: "Hi there! 🕊️ I'm Emmy the Dove!",
    askAge: "How old are you?",
    challenge: "Emmy's Challenge",
    yourScore: "Your Score",
    settings: "Settings",
    soundEnabled: "Sound Enabled",
    language: "Language",
    apiKey: "OpenAI API Key",
    clearHistory: "Clear History",
    downloadHistory: "Download History",
    typePlaceholder: "Type your message here...",
    listening: "Listening...",
    speaking: "Emmy is speaking...",
    generating: "🎨 Generating image...",
    pointsEarned: "🎉 Amazing! You earned {points} points!"
  },
  es: {
    greeting: "¡Hola! 🕊️ ¡Soy Emmy la Paloma!",
    askAge: "¿Cuántos años tienes?",
    challenge: "Desafío de Emmy",
    yourScore: "Tu Puntuación",
    settings: "Configuración",
    soundEnabled: "Sonido Activado",
    language: "Idioma",
    apiKey: "Clave API de OpenAI",
    clearHistory: "Borrar Historial",
    downloadHistory: "Descargar Historial",
    typePlaceholder: "Escribe tu mensaje aquí...",
    listening: "Escuchando...",
    speaking: "Emmy está hablando...",
    generating: "🎨 Generando imagen...",
    pointsEarned: "🎉 ¡Increíble! ¡Ganaste {points} puntos!"
  }
};

// Age-appropriate responses
const responses = {
  3: {
    greeting: "Hi sweetie! 🌟 I'm Emmy! Want to play and learn together?",
    encouragement: "You're so smart! 🎨 Keep asking questions!",
    unknown: "That's interesting! 🤗 Can you tell me more?"
  },
  6: {
    greeting: "Hey there! 🦸 I'm Emmy! Ready for some awesome adventures?",
    encouragement: "That's fantastic thinking! 💡 You're learning so much!",
    unknown: "Great question! 🌟 Let me help you understand that!"
  },
  9: {
    greeting: "Hi! 🎮 I'm Emmy! Let's explore some really important topics together!",
    encouragement: "That's really insightful! 🧠 You're thinking deeply about this!",
    unknown: "That's a thoughtful question! 💭 Let's figure it out together!"
  },
  12: {
    greeting: "Hey! 💭 I'm Emmy. Let's talk about the things that really matter.",
    encouragement: "That shows real wisdom! 🎯 Keep developing those critical thinking skills!",
    unknown: "That's a complex topic! 🌍 Let's explore it together with respect and understanding."
  }
};

// Utility Functions
const analyzeUserInput = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const [age, keywords] of Object.entries(ageKeywords)) {
    const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
    if (matchCount >= 1) {
      return parseInt(age);
    }
  }
  return null;
};

const extractName = (text) => {
  const nameMatch = text.match(/i'?m\s+(.+)|name\s+is\s+(.+)|call\s+me\s+(.+)/i);
  if (nameMatch) {
    const name = (nameMatch[1] || nameMatch[2] || nameMatch[3]).split(' ')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return null;
};

const shouldGenerateImage = (text) => {
  const imageKeywords = ['show', 'draw', 'picture', 'image', 'illustration', 'see', 'look'];
  return imageKeywords.some(keyword => text.toLowerCase().includes(keyword));
};

const getAgeGroup = (age) => {
  if (age <= 5) return 3;
  if (age <= 8) return 6;
  if (age <= 11) return 9;
  return 12;
};

// Main Emmy Component
function EmmyDove() {
  // State
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState({
    age: null,
    name: null,
    points: 0,
    level: 1,
    completedChallenges: [],
    conversationCount: 0
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [apiKey, setApiKey] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Effects
  useEffect(() => {
    loadConversationHistory();
    initializeSpeechRecognition();
    
    // Initial greeting
    setTimeout(() => {
      addEmmyMessage(translations[selectedLanguage].greeting);
    }, 1000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    saveConversationHistory();
  }, [messages, userProfile]);

  // Speech Recognition Setup
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'en' ? 'en-US' : `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  // Speech Synthesis
  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'en' ? 'en-US' : `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
    utterance.rate = 0.9;
    utterance.pitch = userProfile.age && userProfile.age <= 8 ? 1.2 : 1.0;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Message Management
  const addMessage = (sender, text, image = null, isPoints = false) => {
    const message = {
      id: Date.now(),
      sender,
      text,
      image,
      isPoints,
      timestamp: new Date().toISOString(),
      age: userProfile.age,
      language: selectedLanguage
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };

  const addEmmyMessage = (text, image = null) => {
    const message = addMessage('emmy', text, image);
    if (soundEnabled) {
      setTimeout(() => speakText(text), 500);
    }
    return message;
  };

  const addPointsMessage = (points) => {
    const text = translations[selectedLanguage].pointsEarned.replace('{points}', points);
    addMessage('emmy', text, null, true);
  };

  // AI Response Generation
  const generateEmmyResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Analyze user input for age and name
      const detectedAge = analyzeUserInput(userMessage);
      const detectedName = extractName(userMessage);
      
      // Update user profile
      if (detectedAge && !userProfile.age) {
        setUserProfile(prev => ({ ...prev, age: detectedAge }));
      }
      if (detectedName && !userProfile.name) {
        setUserProfile(prev => ({ ...prev, name: detectedName }));
      }

      // Generate image if requested
      let imageUrl = null;
      if (shouldGenerateImage(userMessage) && apiKey) {
        imageUrl = await generateImage(userMessage);
      }

      // Generate response based on age
      const ageGroup = getAgeGroup(userProfile.age || detectedAge || 9);
      let response = generateAgeAppropriateResponse(userMessage, ageGroup);

      // Personalize with name
      if (userProfile.name) {
        response = response.replace(/\b(you|sweetie|there)\b/gi, userProfile.name);
      }

      setTimeout(() => {
        setIsTyping(false);
        addEmmyMessage(response, imageUrl);
        
        // Random points award
        if (Math.random() < 0.3) {
          const points = Math.floor(Math.random() * 15) + 5;
          awardPoints(points);
        }
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      setIsTyping(false);
      addEmmyMessage("I'm having trouble thinking right now. Can you try asking me again? 🤔");
    }
  };

  const generateAgeAppropriateResponse = (message, ageGroup) => {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses[ageGroup].greeting;
    }
    
    // Age-specific topic responses
    if (ageGroup === 3) {
      if (lowerMessage.includes('share') || lowerMessage.includes('kind')) {
        return "Sharing is so wonderful! 🌟 When we share, everyone feels happy! Can you tell me about a time you shared something?";
      }
      if (lowerMessage.includes('color')) {
        return "Colors are amazing! 🎨 What's your favorite color? I love all the pretty colors in the rainbow!";
      }
    } else if (ageGroup === 6) {
      if (lowerMessage.includes('bully') || lowerMessage.includes('mean')) {
        return "Being mean isn't okay! 🦸 Real heroes stand up for others and ask grown-ups for help. You can be a hero too!";
      }
      if (lowerMessage.includes('friend')) {
        return "Friends are special! 👥 Good friends are kind, share, and include everyone. What makes someone a good friend to you?";
      }
    } else if (ageGroup === 9) {
      if (lowerMessage.includes('boundary') || lowerMessage.includes('space')) {
        return "Boundaries are like invisible fences that keep us safe! 🎯 Everyone has the right to say 'no' and have their space respected. What boundaries are important to you?";
      }
      if (lowerMessage.includes('feeling') || lowerMessage.includes('emotion')) {
        return "Feelings are important messages from our hearts! 💭 It's okay to feel angry, sad, happy, or confused. What are you feeling right now?";
      }
    } else if (ageGroup >= 12) {
      if (lowerMessage.includes('relationship')) {
        return "Healthy relationships are built on respect, trust, and communication! 🎭 Both people should feel safe, valued, and free to be themselves. What do you think makes a relationship healthy?";
      }
      if (lowerMessage.includes('consent')) {
        return "Consent means getting a clear 'yes' before doing something that affects another person. 💪 It's about respecting everyone's choices and boundaries. This applies to everything from borrowing something to physical contact.";
      }
    }
    
    // Default encouraging response
    return responses[ageGroup].encouragement;
  };

  // Image Generation
  const generateImage = async (prompt) => {
    if (!apiKey) return null;
    
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Child-friendly, educational illustration for ages ${userProfile.age || 8}: ${prompt}. Colorful, safe, and uplifting style.`,
          n: 1,
          size: '512x512',
          quality: 'standard'
        })
      });
      
      const data = await response.json();
      setIsGeneratingImage(false);
      return data.data[0].url;
    } catch (error) {
      setIsGeneratingImage(false);
      return null;
    }
  };

  // Gamification
  const awardPoints = (points) => {
    setUserProfile(prev => {
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      setTimeout(() => addPointsMessage(points), 500);
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });
  };

  const completeChallenge = (challengeId) => {
    const ageGroup = getAgeGroup(userProfile.age || 9);
    const challenge = challenges[ageGroup]?.find(c => c.id === challengeId);
    
    if (challenge && !userProfile.completedChallenges.includes(challengeId)) {
      setUserProfile(prev => ({
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId]
      }));
      
      awardPoints(challenge.points);
      addEmmyMessage(`Awesome! You completed the ${challenge.title} challenge! 🎉`);
    }
  };

  // Event Handlers
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    addMessage('user', inputText);
    setUserProfile(prev => ({ ...prev, conversationCount: prev.conversationCount + 1 }));
    
    generateEmmyResponse(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Storage
  const loadConversationHistory = () => {
    try {
      const saved = localStorage.getItem('emmy-conversations');
      if (saved) {
        const data = JSON.parse(saved);
        setMessages(data.messages || []);
        setUserProfile(data.profile || userProfile);
      }
    } catch (error) {
      console.log('First time user - initializing');
    }
  };

  const saveConversationHistory = () => {
    const data = {
      messages,
      profile: userProfile,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('emmy-conversations', JSON.stringify(data));
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all conversation history?')) {
      setMessages([]);
      setUserProfile({
        age: null,
        name: null,
        points: 0,
        level: 1,
        completedChallenges: [],
        conversationCount: 0
      });
      localStorage.removeItem('emmy-conversations');
      addEmmyMessage(translations[selectedLanguage].greeting);
    }
  };

  const downloadHistory = () => {
    const data = {
      messages,
      profile: userProfile,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emmy-conversation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get current challenges for user's age
  const getCurrentChallenges = () => {
    const ageGroup = getAgeGroup(userProfile.age || 9);
    return challenges[ageGroup] || challenges[9];
  };

  return (
    <div className="emmy-chatbot">
      {/* Header */}
      <div className="emmy-header">
        <div className="emmy-logo">
          <span className="emmy-mascot">🕊️</span>
          Emmy
        </div>
        <div className="emmy-controls">
          <div className="emmy-points">
            <span>🏆</span>
            <span>{userProfile.points}</span>
            <span>Level {userProfile.level}</span>
          </div>
          <button 
            className={`control-btn ${showChallenges ? 'active' : ''}`}
            onClick={() => setShowChallenges(!showChallenges)}
            title="Challenges"
          >
            ⚡
          </button>
          <button 
            className={`control-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Challenges Panel */}
      {showChallenges && (
        <div className="emmy-panel challenges-panel active">
          <div className="panel-title">{translations[selectedLanguage].challenge}</div>
          <div className="challenges-grid">
            {getCurrentChallenges().map(challenge => (
              <div 
                key={challenge.id} 
                className={`challenge-card ${userProfile.completedChallenges.includes(challenge.id) ? 'completed' : ''}`}
              >
                <div className="challenge-title">{challenge.title}</div>
                <div className="challenge-description">{challenge.description}</div>
                <div className="challenge-points">{challenge.points} points</div>
                <button 
                  className={`challenge-btn ${userProfile.completedChallenges.includes(challenge.id) ? 'completed' : ''}`}
                  onClick={() => completeChallenge(challenge.id)}
                  disabled={userProfile.completedChallenges.includes(challenge.id)}
                >
                  {userProfile.completedChallenges.includes(challenge.id) ? '✓ Done!' : 'Complete'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="emmy-panel settings-panel active">
          <div className="panel-title">{translations[selectedLanguage].settings}</div>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="setting-label">{translations[selectedLanguage].soundEnabled}</span>
              <div 
                className={`toggle-switch ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div className="setting-item">
              <span className="setting-label">{translations[selectedLanguage].language}</span>
              <select 
                className="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
            <div className="setting-item">
              <span className="setting-label">{translations[selectedLanguage].apiKey}</span>
              <input 
                type="password"
                className="api-input"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="setting-item">
              <button className="challenge-btn" onClick={downloadHistory}>
                {translations[selectedLanguage].downloadHistory}
              </button>
              <button className="challenge-btn" onClick={clearHistory}>
                {translations[selectedLanguage].clearHistory}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender} ${message.isPoints ? 'points' : ''}`}>
            <div className="message-avatar">
              {message.sender === 'emmy' ? '🕊️' : message.isPoints ? '🎉' : '👤'}
            </div>
            <div className="message-bubble">
              {message.text}
              {message.image && (
                <img src={message.image} alt="Generated illustration" className="message-image" />
              )}
              {isSpeaking && message === messages[messages.length - 1] && message.sender === 'emmy' && (
                <div className="speaking-indicator">
                  <span>{translations[selectedLanguage].speaking}</span>
                  <div className="speaking-wave">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message emmy">
            <div className="message-avatar">🕊️</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span>Emmy is thinking</span>
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isGeneratingImage && (
          <div className="message emmy">
            <div className="message-avatar">🕊️</div>
            <div className="message-bubble">
              <div className="image-loading">
                <div className="loading-spinner"></div>
                <span>{translations[selectedLanguage].generating}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          className="input-field"
          placeholder={translations[selectedLanguage].typePlaceholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className={`input-btn voice-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          title={isListening ? translations[selectedLanguage].listening : "Voice Input"}
        >
          🎤
        </button>
        <button 
          className="input-btn send-btn"
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          title="Send Message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// Render the component
ReactDOM.render(<EmmyDove />, document.getElementById('emmy-chatbot-root'));