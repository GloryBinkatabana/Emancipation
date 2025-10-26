/* JavaScript for age-9-11.html - Reality Rangers functionality */

// Scenario Data
const groupChatScenario = {
    messages: [
        { from: "Alex", text: "Did you see what Maya wore today? LOL 😂", time: "3:45 PM" },
        { from: "Jordan", text: "Yeah so weird haha", time: "3:46 PM" },
        { from: "System", text: "What do you do?", time: "NOW", isChoice: true }
    ],
    choices: [
        {
            text: "Join in the laughing 😆",
            outcome: "negative",
            skills: { empathy: -5, respect: -3 },
            result: "The bullying continued and Maya saw the messages. She felt terrible and alone. Cyberbullying hurts just as much as in-person bullying."
        },
        {
            text: "Say 'That's mean, stop it' 🛑",
            outcome: "positive",
            skills: { courage: 5, respect: 3 },
            result: "Your friends paused and realized they were being hurtful. Alex apologized and they stopped. You showed real courage!"
        },
        {
            text: "Leave the group and tell a trusted adult 🚨",
            outcome: "best",
            skills: { courage: 8, wisdom: 5 },
            result: "You protected Maya and got help from an adult. The bullying was stopped and Maya thanked you. You made the brave choice!"
        },
        {
            text: "Say nothing and keep scrolling 📱",
            outcome: "passive",
            skills: { courage: -2 },
            result: "The bullying continued. Sometimes silence can hurt too. It's important to stand up or get help when you see bullying."
        }
    ]
};

let scenarioChoice = null;

// Initialize Scenario
function initScenario() {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';

    groupChatScenario.messages.forEach(msg => {
        if (msg.isChoice) {
            let choiceHTML = `
                <div class="choice-prompt">
                    <div class="choice-prompt-text">${msg.text}</div>
                    <div class="scenario-choices">
            `;
            
            groupChatScenario.choices.forEach((choice, index) => {
                choiceHTML += `
                    <div class="scenario-choice" onclick="makeScenarioChoice(${index})">
                        ${choice.text}
                    </div>
                `;
            });
            
            choiceHTML += `</div></div>`;
            container.innerHTML += choiceHTML;
        } else {
            container.innerHTML += `
                <div class="message">
                    <div class="message-sender">${msg.from}</div>
                    <div>${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        }
    });
}

function makeScenarioChoice(index) {
    const choice = groupChatScenario.choices[index];
    scenarioChoice = choice;
    
    // Show result
    alert(`Result: ${choice.result}\n\nOutcome: ${choice.outcome.toUpperCase()}`);
    
    // Update skills
    updateSkills(choice.skills);
    
    // Record activity
    recordActivity({
        type: 'scenario',
        name: 'The Group Chat',
        choice: choice.text,
        outcome: choice.outcome,
        completed: true
    });
}

// Rhythm Game
let rhythmCanvas, rhythmCtx;
let rhythmScore = 0;
let rhythmCombo = 0;
let notes = [];
let gameActive = false;

const consentPhrases = [
    { text: "Can I borrow this?", key: "A" },
    { text: "Is this okay?", key: "S" },
    { text: "What do you think?", key: "K" },
    { text: "I respect your choice", key: "L" },
    { text: "May I join you?", key: "A" },
    { text: "Do you need space?", key: "S" },
    { text: "Let me know!", key: "K" },
    { text: "Your feelings matter", key: "L" }
];

function startRhythmGame() {
    if (gameActive) return;
    
    rhythmCanvas = document.getElementById('rhythmCanvas');
    rhythmCtx = rhythmCanvas.getContext('2d');
    rhythmCanvas.width = 800;
    rhythmCanvas.height = 600;
    
    rhythmScore = 0;
    rhythmCombo = 0;
    notes = [];
    gameActive = true;
    
    document.getElementById('startRhythmBtn').textContent = 'Game Running...';
    document.getElementById('startRhythmBtn').disabled = true;
    
    // Generate notes
    consentPhrases.forEach((phrase, index) => {
        notes.push({
            key: phrase.key,
            phrase: phrase.text,
            y: -50 - (index * 150),
            hit: false,
            lane: phrase.key === 'A' ? 0 : phrase.key === 'S' ? 1 : phrase.key === 'K' ? 2 : 3
        });
    });
    
    // Add keyboard listener
    document.addEventListener('keydown', handleRhythmKey);
    
    rhythmGameLoop();
}

function rhythmGameLoop() {
    if (!gameActive) return;
    
    rhythmCtx.clearRect(0, 0, rhythmCanvas.width, rhythmCanvas.height);
    
    // Draw lanes
    const laneWidth = 200;
    const colors = ['#FFD93D', '#74b9ff', '#55efc4', '#fd79a8'];
    for (let i = 0; i < 4; i++) {
        rhythmCtx.fillStyle = colors[i];
        rhythmCtx.globalAlpha = 0.3;
        rhythmCtx.fillRect(i * laneWidth, 0, laneWidth, 600);
        rhythmCtx.globalAlpha = 1;
    }
    
    // Draw target zone
    rhythmCtx.fillStyle = 'white';
    rhythmCtx.fillRect(0, 520, 800, 60);
    
    // Draw and update notes
    let allNotesGone = true;
    notes.forEach(note => {
        if (!note.hit) {
            allNotesGone = false;
            note.y += 2;
            
            // Draw note
            rhythmCtx.fillStyle = colors[note.lane];
            rhythmCtx.fillRect(note.lane * 200 + 50, note.y, 100, 40);
            rhythmCtx.fillStyle = 'white';
            rhythmCtx.font = '12px Arial';
            rhythmCtx.textAlign = 'center';
            rhythmCtx.fillText(note.phrase, note.lane * 200 + 100, note.y + 25);
            
            // Check if missed
            if (note.y > 600) {
                note.hit = true;
                rhythmCombo = 0;
            }
        }
    });
    
    if (allNotesGone) {
        endRhythmGame();
        return;
    }
    
    requestAnimationFrame(rhythmGameLoop);
}

function handleRhythmKey(e) {
    const key = e.key.toUpperCase();
    if (!['A', 'S', 'K', 'L'].includes(key)) return;
    
    // Find nearest note in this lane
    const lane = key === 'A' ? 0 : key === 'S' ? 1 : key === 'K' ? 2 : 3;
    const note = notes.find(n => !n.hit && n.lane === lane && Math.abs(n.y - 540) < 60);
    
    if (note) {
        note.hit = true;
        const distance = Math.abs(note.y - 540);
        
        if (distance < 20) {
            rhythmScore += 100;
            rhythmCombo++;
        } else {
            rhythmScore += 50;
            rhythmCombo++;
        }
        
        updateRhythmScore();
    }
}

function updateRhythmScore() {
    document.getElementById('rhythmScore').textContent = rhythmScore;
    document.getElementById('rhythmCombo').textContent = rhythmCombo;
}

function endRhythmGame() {
    gameActive = false;
    document.removeEventListener('keydown', handleRhythmKey);
    document.getElementById('startRhythmBtn').textContent = 'Play Again';
    document.getElementById('startRhythmBtn').disabled = false;
    
    alert(`Great job! Final Score: ${rhythmScore}\nYou learned ${consentPhrases.length} consent phrases!`);
    
    recordActivity({
        type: 'rhythm_game',
        name: 'Consent Beat',
        score: rhythmScore,
        completed: true
    });
}

// Podcast Player
let podcastPlaying = false;

function togglePodcast() {
    const btn = document.getElementById('podcastBtn');
    if (podcastPlaying) {
        btn.textContent = '▶️ Play Episode';
        podcastPlaying = false;
    } else {
        btn.textContent = '⏸️ Pause Episode';
        podcastPlaying = true;
        
        // Simulate podcast completion after 5 seconds
        setTimeout(() => {
            if (podcastPlaying) {
                btn.textContent = '▶️ Play Episode';
                podcastPlaying = false;
                alert('Episode complete! Great listening!');
                recordActivity({
                    type: 'podcast',
                    name: 'Rangers Radio Episode 1',
                    completed: true
                });
            }
        }, 5000);
    }
}

// Ask Anything
function submitQuestion() {
    const question = document.getElementById('askQuestion').value.trim();
    const category = document.getElementById('askCategory').value;
    
    if (!question) {
        alert('Please enter a question!');
        return;
    }
    
    if (!category) {
        alert('Please select a category!');
        return;
    }
    
    // Save question
    const questions = JSON.parse(localStorage.getItem('user_questions') || '[]');
    questions.push({
        question,
        category,
        timestamp: new Date().toISOString(),
        answered: false
    });
    localStorage.setItem('user_questions', JSON.stringify(questions));
    
    alert('Thank you for your question! A counselor will review it and provide an answer soon. Check back later!');
    document.getElementById('askQuestion').value = '';
    document.getElementById('askCategory').value = '';
    
    recordActivity({
        type: 'question',
        name: 'Asked a Question',
        category: category,
        completed: true
    });
}

// Content Creation
let currentTab = 'story';

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const area = document.getElementById('creationArea');
    if (tab === 'story') {
        area.innerHTML = `
            <label class="form-label">Your Story Title:</label>
            <input type="text" class="form-input" id="storyTitle" placeholder="Give your story a title...">
            <label class="form-label">Write Your Story:</label>
            <textarea class="form-textarea" id="storyContent" placeholder="Write about respect, kindness, standing up for others, or your own experiences..." style="min-height: 300px;"></textarea>
            <button class="submit-question-btn" onclick="saveContent()">Save My Creation</button>
        `;
    } else if (tab === 'poster') {
        area.innerHTML = `
            <label class="form-label">Poster Message:</label>
            <input type="text" class="form-input" id="posterMessage" placeholder="E.g., 'Respect Everyone' or 'Stand Up to Bullying'">
            <label class="form-label">Choose Design:</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="padding: 2rem; background: linear-gradient(135deg, #FFD93D 0%, #fd79a8 100%); border-radius: 10px; cursor: pointer; text-align: center;" onclick="selectDesign('colorful')">Colorful</div>
                <div style="padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; cursor: pointer; text-align: center; color: white;" onclick="selectDesign('bold')">Bold</div>
                <div style="padding: 2rem; background: linear-gradient(135deg, #55efc4 0%, #00b894 100%); border-radius: 10px; cursor: pointer; text-align: center; color: white;" onclick="selectDesign('nature')">Nature</div>
            </div>
            <button class="submit-question-btn" onclick="saveContent()">Save My Poster</button>
        `;
    } else if (tab === 'poem') {
        area.innerHTML = `
            <label class="form-label">Poem Title:</label>
            <input type="text" class="form-input" id="poemTitle" placeholder="Give your poem a title...">
            <label class="form-label">Write Your Poem:</label>
            <textarea class="form-textarea" id="poemContent" placeholder="Express your feelings about kindness, respect, or courage..." style="min-height: 300px;"></textarea>
            <button class="submit-question-btn" onclick="saveContent()">Save My Poem</button>
        `;
    }
}

function saveContent() {
    let content = {};
    
    if (currentTab === 'story') {
        const title = document.getElementById('storyTitle')?.value.trim();
        const text = document.getElementById('storyContent')?.value.trim();
        if (!title || !text) {
            alert('Please fill in both title and content!');
            return;
        }
        content = { type: 'story', title, text };
    } else if (currentTab === 'poster') {
        const message = document.getElementById('posterMessage')?.value.trim();
        if (!message) {
            alert('Please enter a poster message!');
            return;
        }
        content = { type: 'poster', message };
    } else if (currentTab === 'poem') {
        const title = document.getElementById('poemTitle')?.value.trim();
        const text = document.getElementById('poemContent')?.value.trim();
        if (!title || !text) {
            alert('Please fill in both title and poem!');
            return;
        }
        content = { type: 'poem', title, text };
    }
    
    const creations = JSON.parse(localStorage.getItem('user_creations') || '[]');
    creations.push({
        ...content,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('user_creations', JSON.stringify(creations));
    
    alert('Your creation has been saved! Great work, Ranger!');
    
    recordActivity({
        type: 'creation',
        name: `Created ${currentTab}`,
        completed: true
    });
}

// Skills Management
function updateSkills(changes) {
    const userId = getUserId();
    let skills = JSON.parse(localStorage.getItem(`skills_${userId}`) || '{"empathy": 75, "courage": 60, "wisdom": 80}');
    
    Object.keys(changes).forEach(skill => {
        skills[skill] = Math.max(0, Math.min(100, (skills[skill] || 50) + changes[skill]));
    });
    
    localStorage.setItem(`skills_${userId}`, JSON.stringify(skills));
    updateSkillsDisplay();
}

function updateSkillsDisplay() {
    const userId = getUserId();
    let skills = JSON.parse(localStorage.getItem(`skills_${userId}`) || '{"empathy": 75, "courage": 60, "wisdom": 80}');
    
    document.getElementById('empathyStat').textContent = skills.empathy + '%';
    document.getElementById('courageStat').textContent = skills.courage + '%';
    document.getElementById('wisdomStat').textContent = skills.wisdom + '%';
    
    // Update rank
    const avgSkill = (skills.empathy + skills.courage + skills.wisdom) / 3;
    let rank = 'Junior Ranger';
    if (avgSkill >= 80) rank = 'Elite Ranger';
    else if (avgSkill >= 65) rank = 'Senior Ranger';
    
    document.getElementById('rankDisplay').textContent = `🎯 ${rank}`;
}

// Mission Management
function showMission(missionName) {
    document.querySelectorAll('.mission-area').forEach(area => {
        area.classList.remove('active');
    });

    const mission = document.getElementById(missionName);
    mission.classList.add('active');

    // Initialize mission-specific content
    if (missionName === 'scenarios') {
        initScenario();
    }
}

// Progress Tracking
function recordActivity(activity) {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": []}');
    
    progress.activities.push({
        ...activity,
        timestamp: new Date().toISOString(),
        ageGroup: '9-11'
    });
    
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
}

function getUserId() {
    const user = JSON.parse(localStorage.getItem('emancipation_user') || '{"id": "demo_user"}');
    return user.id;
}

// Initialize on load
window.addEventListener('load', () => {
    updateSkillsDisplay();
});