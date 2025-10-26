/* JavaScript for age-6-8.html - Heroes of Home functionality */

// Comic Data
const comicEpisode = {
    title: "Playground Justice",
    panels: [
        {
            image: "🏫",
            dialogues: [
                { speaker: "Narrator", text: "At recess, Max noticed something wrong on the playground..." }
            ]
        },
        {
            image: "😠",
            dialogues: [
                { speaker: "Bully", text: "You can't play with us!" },
                { speaker: "Victim", text: "But... I just want to play..." }
            ]
        },
        {
            image: "😡",
            dialogues: [
                { speaker: "Max", text: "Hey! Everyone can play!" },
                { speaker: "Bully", text: "Mind your own business!" }
            ]
        },
        {
            image: "🤔",
            dialogues: [
                { speaker: "Narrator", text: "Max has to make a choice. What should Max do?" }
            ],
            hasChoice: true,
            choices: [
                { text: "Get a teacher to help", category: "brave", points: 10, outcome: "teacher" },
                { text: "Fight the bully", category: "aggressive", points: 0, outcome: "fight" },
                { text: "Ask other kids to help", category: "brave", points: 15, outcome: "group" },
                { text: "Walk away", category: "passive", points: 2, outcome: "walk" }
            ]
        }
    ],
    endings: {
        teacher: [
            {
                image: "👩‍🏫",
                dialogues: [
                    { speaker: "Teacher", text: "Thank you for telling me, Max. That was very brave." },
                    { speaker: "Narrator", text: "The teacher helped solve the problem. Everyone got to play together!" }
                ]
            }
        ],
        fight: [
            {
                image: "😢",
                dialogues: [
                    { speaker: "Narrator", text: "Fighting made things worse. Everyone got in trouble and felt bad." },
                    { speaker: "Max", text: "I wish I had made a better choice..." }
                ]
            }
        ],
        group: [
            {
                image: "🎉",
                dialogues: [
                    { speaker: "Friends", text: "We all think everyone should play!" },
                    { speaker: "Narrator", text: "Together, the kids stood up for what's right. The bully apologized and everyone played together!" }
                ]
            }
        ],
        walk: [
            {
                image: "😔",
                dialogues: [
                    { speaker: "Narrator", text: "Max walked away. The bullying continued and the victim felt alone." },
                    { speaker: "Max", text: "Maybe I should have helped..." }
                ]
            }
        ]
    }
};

let currentPanels = [...comicEpisode.panels];
let currentPanel = 0;
let userChoice = null;
let totalPoints = 0;

// Initialize Comic
function initComic() {
    currentPanel = 0;
    currentPanels = [...comicEpisode.panels];
    updateComicPanel();
}

function updateComicPanel() {
    const panel = currentPanels[currentPanel];
    const panelDiv = document.getElementById('comicPanel');
    
    let html = `<div class="panel-image">${panel.image}</div>`;
    
    panel.dialogues.forEach(dialogue => {
        html += `
            <div class="dialogue-box">
                <div class="speaker-name">${dialogue.speaker}:</div>
                <div class="dialogue-text">${dialogue.text}</div>
            </div>
        `;
    });
    
    panelDiv.innerHTML = html;

    // Update controls
    document.getElementById('prevPanelBtn').disabled = currentPanel === 0;
    document.getElementById('nextPanelBtn').style.display = panel.hasChoice ? 'none' : 'inline-block';
    
    if (currentPanel === currentPanels.length - 1 && !panel.hasChoice) {
        document.getElementById('nextPanelBtn').textContent = '🎉 Finish';
        document.getElementById('nextPanelBtn').onclick = finishComic;
    } else {
        document.getElementById('nextPanelBtn').textContent = 'Next ➡️';
        document.getElementById('nextPanelBtn').onclick = nextPanel;
    }

    // Show choices if applicable
    const choicePanel = document.getElementById('choicePanel');
    if (panel.hasChoice) {
        let choiceHtml = `
            <div class="choice-panel">
                <p class="choice-question">What should Max do?</p>
                <div class="choice-options">
        `;
        
        panel.choices.forEach((choice, index) => {
            choiceHtml += `
                <div class="choice-option" onclick="makeComicChoice(${index})">
                    ${choice.text}
                </div>
            `;
        });
        
        choiceHtml += `</div></div>`;
        choicePanel.innerHTML = choiceHtml;
    } else {
        choicePanel.innerHTML = '';
    }
}

function nextPanel() {
    if (currentPanel < currentPanels.length - 1) {
        currentPanel++;
        updateComicPanel();
    }
}

function previousPanel() {
    if (currentPanel > 0) {
        currentPanel--;
        updateComicPanel();
    }
}

function makeComicChoice(choiceIndex) {
    const choice = currentPanels[currentPanel].choices[choiceIndex];
    userChoice = choice.category;
    totalPoints += choice.points;
    
    // Add ending panels
    const endingPanels = comicEpisode.endings[choice.outcome];
    currentPanels = [...currentPanels.slice(0, currentPanel + 1), ...endingPanels];
    
    nextPanel();
}

function finishComic() {
    alert(`Great job! You earned ${totalPoints} hero points!\n\nChoice: ${userChoice}`);
    
    recordActivity({
        type: 'comic',
        name: 'Playground Justice',
        choice: userChoice,
        points: totalPoints,
        completed: true
    });

    updateMissionCounter();
    checkBadges();
}

// Training Game
const scenarios = [
    {
        image: "🚶‍♂️",
        text: "Someone pushes in line",
        options: [
            { text: "Push them back", score: 0, feedback: "Violence isn't the answer", category: "aggressive" },
            { text: "Tell them politely to wait their turn", score: 10, feedback: "Great communication!", category: "respectful" },
            { text: "Tell a teacher", score: 8, feedback: "Good! Asking for help is smart", category: "brave" }
        ]
    },
    {
        image: "⚽",
        text: "A friend won't share the ball",
        options: [
            { text: "Grab it from them", score: 0, feedback: "That's not respectful", category: "aggressive" },
            { text: "Ask nicely if you can take turns", score: 10, feedback: "Perfect! Taking turns is fair", category: "respectful" },
            { text: "Stop being their friend", score: 2, feedback: "That's not kind", category: "passive" }
        ]
    },
    {
        image: "😭",
        text: "Someone is crying alone",
        options: [
            { text: "Ignore them", score: 0, feedback: "We should help people who are sad", category: "passive" },
            { text: "Ask if they're okay and get help", score: 10, feedback: "You're a true hero!", category: "empathetic" },
            { text: "Laugh at them", score: 0, feedback: "That's mean. Be kind to others", category: "aggressive" }
        ]
    },
    {
        image: "🎮",
        text: "Someone says 'girls can't play video games'",
        options: [
            { text: "Agree with them", score: 0, feedback: "Everyone can play! That's not fair", category: "passive" },
            { text: "Say 'Everyone can play anything they want!'", score: 10, feedback: "Yes! That's equality!", category: "brave" },
            { text: "Tell them they're wrong and walk away", score: 5, feedback: "Good, but you could help them understand better", category: "passive" }
        ]
    },
    {
        image: "🍎",
        text: "A classmate forgot their lunch",
        options: [
            { text: "Keep your lunch to yourself", score: 2, feedback: "Sharing is caring", category: "passive" },
            { text: "Share some of your food", score: 10, feedback: "So kind! You're a hero!", category: "empathetic" },
            { text: "Make fun of them", score: 0, feedback: "That's not kind at all", category: "aggressive" }
        ]
    }
];

let currentScenario = 0;
let trainingScore = 0;
let trainingTimer = null;
let timeLeft = 5;

function startTraining() {
    currentScenario = 0;
    trainingScore = 0;
    document.getElementById('startTrainingBtn').style.display = 'none';
    loadScenario();
}

function loadScenario() {
    if (currentScenario >= scenarios.length) {
        endTraining();
        return;
    }

    const scenario = scenarios[currentScenario];
    document.getElementById('scenarioImage').textContent = scenario.image;
    document.getElementById('scenarioText').textContent = scenario.text;

    // Load options
    const optionsDiv = document.getElementById('responseOptions');
    optionsDiv.innerHTML = '';
    
    scenario.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.textContent = option.text;
        btn.onclick = () => selectResponse(index);
        optionsDiv.appendChild(btn);
    });

    // Start timer
    timeLeft = 5;
    updateTimer();
    trainingTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(trainingTimer);
            selectResponse(-1); // Time's up
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timerDisplay').textContent = `Time: ${timeLeft}s`;
}

function selectResponse(index) {
    clearInterval(trainingTimer);
    
    const scenario = scenarios[currentScenario];
    const buttons = document.querySelectorAll('.response-btn');
    
    if (index >= 0) {
        const selected = scenario.options[index];
        trainingScore += selected.score;
        
        // Show feedback
        buttons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add(selected.score >= 8 ? 'correct' : 'incorrect');
            }
            btn.disabled = true;
        });

        alert(selected.feedback);
    } else {
        alert("Time's up! Try to be quicker next time.");
    }

    document.getElementById('trainingScore').textContent = `Score: ${trainingScore} points`;

    setTimeout(() => {
        currentScenario++;
        loadScenario();
    }, 2000);
}

function endTraining() {
    document.getElementById('scenarioImage').textContent = '🎉';
    document.getElementById('scenarioText').textContent = `Training complete! Final score: ${trainingScore} points`;
    document.getElementById('responseOptions').innerHTML = '';
    document.getElementById('timerDisplay').textContent = '';
    document.getElementById('startTrainingBtn').style.display = 'block';
    document.getElementById('startTrainingBtn').textContent = 'Train Again';

    recordActivity({
        type: 'training',
        name: 'Respect Response Training',
        score: trainingScore,
        completed: true
    });

    updateMissionCounter();
    checkBadges();
}

// Hero Creator
let heroData = {
    look: null,
    power: null,
    name: null
};

function selectCreatorOption(element, type, value) {
    // Remove selection from siblings
    element.parentElement.querySelectorAll('.creator-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select this option
    element.classList.add('selected');
    heroData[type] = value;

    // Auto-advance after short delay
    setTimeout(() => {
        if (type === 'look' || type === 'power') {
            nextCreatorStep();
        }
    }, 500);
}

function nextCreatorStep() {
    const steps = document.querySelectorAll('.creator-step');
    let currentStep = document.querySelector('.creator-step.active');
    let stepNum = parseInt(currentStep.dataset.step);

    if (stepNum < steps.length) {
        currentStep.classList.remove('active');
        steps[stepNum].classList.add('active');
    }
}

function completeHero() {
    heroData.name = document.getElementById('heroName').value.trim();
    
    if (!heroData.name) {
        alert('Please enter a hero name!');
        return;
    }

    // Hide steps and show preview
    document.querySelectorAll('.creator-step').forEach(step => step.style.display = 'none');
    
    const preview = document.getElementById('heroPreview');
    document.getElementById('previewChar').textContent = heroData.look;
    document.getElementById('previewName').textContent = heroData.name;
    document.getElementById('previewPower').textContent = `Power: ${heroData.power}`;
    preview.style.display = 'block';
}

function saveHero() {
    const userId = getUserId();
    localStorage.setItem(`hero_${userId}`, JSON.stringify(heroData));
    
    alert(`${heroData.name} has been saved! You're now a true hero!`);
    
    recordActivity({
        type: 'hero_creator',
        name: 'Created Hero',
        hero: heroData,
        completed: true
    });

    updateMissionCounter();
    checkBadges();
}

// Badge System
const allBadges = [
    { id: 'kindness_cadet', name: 'Kindness Cadet', icon: '🌟', description: 'Complete 3 missions', requirement: 3 },
    { id: 'respect_ranger', name: 'Respect Ranger', icon: '🎖️', description: 'Perfect score on training', requirement: 50 },
    { id: 'inclusion_hero', name: 'Inclusion Hero', icon: '🤝', description: 'Choose kind options', requirement: 1 },
    { id: 'creator_champion', name: 'Creator Champion', icon: '⚡', description: 'Create a hero', requirement: 1 },
    { id: 'comic_master', name: 'Comic Master', icon: '📚', description: 'Finish a comic', requirement: 1 },
    { id: 'brave_heart', name: 'Brave Heart', icon: '🛡️', description: 'Stand up for others', requirement: 1 }
];

function initBadges() {
    const showcase = document.getElementById('badgeShowcase');
    const userId = getUserId();
    const earnedBadges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');

    showcase.innerHTML = '';
    allBadges.forEach(badge => {
        const earned = earnedBadges.includes(badge.id);
        const div = document.createElement('div');
        div.className = `badge-item ${earned ? 'earned' : 'locked'}`;
        div.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div style="font-size: 0.8rem; color: #718096; margin-top: 0.5rem;">${badge.description}</div>
        `;
        showcase.appendChild(div);
    });
}

function checkBadges() {
    const userId = getUserId();
    const progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": []}');
    const earnedBadges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');

    // Check for new badges
    const missionCount = progress.activities.length;
    
    if (missionCount >= 3 && !earnedBadges.includes('kindness_cadet')) {
        awardBadge('kindness_cadet');
    }

    // Check training score
    const trainingActivities = progress.activities.filter(a => a.type === 'training');
    if (trainingActivities.some(a => a.score >= 50) && !earnedBadges.includes('respect_ranger')) {
        awardBadge('respect_ranger');
    }

    // Check hero creation
    if (progress.activities.some(a => a.type === 'hero_creator') && !earnedBadges.includes('creator_champion')) {
        awardBadge('creator_champion');
    }

    // Check comic completion
    if (progress.activities.some(a => a.type === 'comic') && !earnedBadges.includes('comic_master')) {
        awardBadge('comic_master');
    }
}

function awardBadge(badgeId) {
    const userId = getUserId();
    const earnedBadges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');
    
    if (!earnedBadges.includes(badgeId)) {
        earnedBadges.push(badgeId);
        localStorage.setItem(`badges_${userId}`, JSON.stringify(earnedBadges));
        
        const badge = allBadges.find(b => b.id === badgeId);
        alert(`🎉 New Badge Earned!\n\n${badge.icon} ${badge.name}\n${badge.description}`);
        
        updateHeroBadge();
        initBadges();
    }
}

function updateHeroBadge() {
    const userId = getUserId();
    const earnedBadges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');
    
    let badgeText = '🦸 New Hero';
    if (earnedBadges.length >= 3) badgeText = '🦸 Respect Hero';
    if (earnedBadges.length >= 5) badgeText = '🦸 Super Hero';
    
    document.getElementById('heroBadge').textContent = badgeText;
}

// Mission Management
function showMission(missionName) {
    document.querySelectorAll('.mission-space').forEach(space => {
        space.classList.remove('active');
    });

    const mission = document.getElementById(missionName);
    mission.classList.add('active');

    // Initialize mission-specific content
    if (missionName === 'comics' && currentPanel === 0) {
        initComic();
    } else if (missionName === 'badges') {
        initBadges();
    }
}

// Progress Tracking
function recordActivity(activity) {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": []}');
    
    progress.activities.push({
        ...activity,
        timestamp: new Date().toISOString(),
        ageGroup: '6-8'
    });
    
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
}

function updateMissionCounter() {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": []}');
    const completed = progress.activities.filter(a => a.completed).length;
    document.getElementById('missionCounter').textContent = `Missions: ${completed}/12`;
}

function getUserId() {
    const user = JSON.parse(localStorage.getItem('emancipation_user') || '{"id": "demo_user"}');
    return user.id;
}

// Initialize on load
window.addEventListener('load', () => {
    updateMissionCounter();
    updateHeroBadge();
});