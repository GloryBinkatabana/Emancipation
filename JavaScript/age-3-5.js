/* JavaScript for age-3-5.html - Kindness Kingdom functionality */

// Story Data
const stories = {
    luluStory: [
        {
            image: "🧸",
            text: "Lulu found a toy on the playground. It was so pretty!",
            audio: null
        },
        {
            image: "🤔",
            text: "But wait... this toy doesn't belong to Lulu. What should she do?",
            audio: null
        },
        {
            image: "❓",
            text: "Lulu has two choices. She could keep the toy, or find its owner.",
            audio: null,
            hasChoice: true,
            choices: [
                { text: "Keep the toy 🧸", outcome: "keep", category: "selfish" },
                { text: "Find the owner 🔍", outcome: "share", category: "empathetic" }
            ]
        }
    ],
    keepEnding: [
        {
            image: "😢",
            text: "Lulu kept the toy. But another child was crying because they lost it.",
            audio: null
        },
        {
            image: "😔",
            text: "Lulu felt bad inside. Keeping things that aren't ours doesn't feel good.",
            audio: null
        }
    ],
    shareEnding: [
        {
            image: "😊",
            text: "Lulu found the toy's owner! They were so happy!",
            audio: null
        },
        {
            image: "🌟",
            text: "Everyone felt happy! Doing the right thing makes everyone smile!",
            audio: null
        }
    ]
};

let currentStory = [...stories.luluStory];
let currentScene = 0;
let userChoice = null;

// Initialize story
function initStory() {
    currentScene = 0;
    updateStory();
}

function updateStory() {
    const scene = currentStory[currentScene];
    document.getElementById('storyImage').textContent = scene.image;
    document.getElementById('storyText').textContent = scene.text;

    // Update buttons
    document.getElementById('prevBtn').disabled = currentScene === 0;
    document.getElementById('nextBtn').style.display = scene.hasChoice ? 'none' : 'inline-block';
    
    if (currentScene === currentStory.length - 1 && !scene.hasChoice) {
        document.getElementById('nextBtn').textContent = '🎉 Finish';
        document.getElementById('nextBtn').onclick = finishStory;
    } else {
        document.getElementById('nextBtn').textContent = 'Next ➡️';
        document.getElementById('nextBtn').onclick = nextScene;
    }

    // Show choices if applicable
    const choiceContainer = document.getElementById('choiceContainer');
    if (scene.hasChoice) {
        choiceContainer.innerHTML = '';
        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => makeChoice(choice);
            choiceContainer.appendChild(btn);
        });
    } else {
        choiceContainer.innerHTML = '';
    }
}

function nextScene() {
    if (currentScene < currentStory.length - 1) {
        currentScene++;
        updateStory();
    }
}

function previousScene() {
    if (currentScene > 0) {
        currentScene--;
        updateStory();
    }
}

function makeChoice(choice) {
    userChoice = choice.category;
    
    // Add appropriate ending
    if (choice.outcome === 'keep') {
        currentStory = [...currentStory.slice(0, currentScene + 1), ...stories.keepEnding];
    } else {
        currentStory = [...currentStory.slice(0, currentScene + 1), ...stories.shareEnding];
    }
    
    nextScene();
}

function finishStory() {
    showReflection("How did that story make you feel?");
    
    // Record activity
    recordActivity({
        type: 'story',
        name: 'Lulu and the Lost Toy',
        choice: userChoice,
        completed: true
    });
}

// Game Logic
let gameCanvas, gameCtx;
let gameScore = 0;
let toys = [];
let friends = [];
let draggedToy = null;

function initGame() {
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    
    // Set canvas size
    gameCanvas.width = 800;
    gameCanvas.height = 600;

    // Initialize toys
    toys = [
        { emoji: '⚽', x: 100, y: 500, dragging: false, matched: false },
        { emoji: '🎨', x: 250, y: 500, dragging: false, matched: false },
        { emoji: '🚗', x: 400, y: 500, dragging: false, matched: false },
        { emoji: '🧩', x: 550, y: 500, dragging: false, matched: false }
    ];

    // Initialize friends (positioned in circle)
    friends = [
        { name: 'Anna', emoji: '👧', x: 400, y: 100, wants: '🎨', happy: false },
        { name: 'Ben', emoji: '👦', x: 650, y: 300, wants: '⚽', happy: false },
        { name: 'Carla', emoji: '👧🏽', x: 400, y: 450, wants: '🧩', happy: false },
        { name: 'Danny', emoji: '👦🏻', x: 150, y: 300, wants: '🚗', happy: false }
    ];

    // Event listeners
    gameCanvas.addEventListener('mousedown', handleGameMouseDown);
    gameCanvas.addEventListener('mousemove', handleGameMouseMove);
    gameCanvas.addEventListener('mouseup', handleGameMouseUp);
    
    // Touch events
    gameCanvas.addEventListener('touchstart', handleGameTouchStart);
    gameCanvas.addEventListener('touchmove', handleGameTouchMove);
    gameCanvas.addEventListener('touchend', handleGameTouchEnd);

    gameLoop();
}

function gameLoop() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw friends
    friends.forEach(friend => {
        gameCtx.font = '60px Arial';
        gameCtx.fillText(friend.emoji, friend.x - 30, friend.y);
        
        gameCtx.font = '20px Arial';
        gameCtx.fillStyle = '#2d3748';
        gameCtx.textAlign = 'center';
        gameCtx.fillText(friend.name, friend.x, friend.y + 40);
        
        if (friend.happy) {
            gameCtx.font = '40px Arial';
            gameCtx.fillText('😊', friend.x, friend.y - 50);
        }
    });

    // Draw toys
    toys.forEach(toy => {
        if (!toy.matched) {
            gameCtx.font = '50px Arial';
            gameCtx.fillText(toy.emoji, toy.x, toy.y);
        }
    });

    requestAnimationFrame(gameLoop);
}

function handleGameMouseDown(e) {
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    toys.forEach(toy => {
        if (!toy.matched && x >= toy.x && x <= toy.x + 50 && y >= toy.y - 50 && y <= toy.y) {
            toy.dragging = true;
            draggedToy = toy;
        }
    });
}

function handleGameMouseMove(e) {
    if (draggedToy) {
        const rect = gameCanvas.getBoundingClientRect();
        draggedToy.x = e.clientX - rect.left - 25;
        draggedToy.y = e.clientY - rect.top;
    }
}

function handleGameMouseUp(e) {
    if (draggedToy) {
        checkMatch(draggedToy);
        draggedToy.dragging = false;
        draggedToy = null;
    }
}

function handleGameTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleGameMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleGameTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleGameMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleGameTouchEnd(e) {
    e.preventDefault();
    handleGameMouseUp(e);
}

function checkMatch(toy) {
    friends.forEach(friend => {
        const distance = Math.sqrt(
            Math.pow(toy.x - friend.x, 2) + Math.pow(toy.y - friend.y, 2)
        );

        if (distance < 80 && toy.emoji === friend.wants && !friend.happy) {
            friend.happy = true;
            toy.matched = true;
            gameScore += 10;
            updateGameScore();
            playCheerSound();

            // Check if game complete
            if (friends.every(f => f.happy)) {
                setTimeout(() => {
                    showReflection("How did it feel to share toys with your friends?");
                    recordActivity({
                        type: 'game',
                        name: 'Sharing Circle',
                        score: gameScore,
                        completed: true
                    });
                }, 1000);
            }
        }
    });
}

function updateGameScore() {
    const stars = '⭐'.repeat(gameScore / 10);
    document.getElementById('gameScore').textContent = `Stars: ${stars} ${gameScore}`;
}

// Song Logic
const songLyrics = [
    "Share your toys, share your smile 😊",
    "Being kind is always in style! ✨",
    "Ask before you hug so tight 🤗",
    "Treating friends with love is right! ❤️",
    "Everyone is special too 🌟",
    "They're different just like you! 🌈",
    "Kindness makes the world so bright 🌍",
    "Let's be kind both day and night! 🌙"
];

let songInterval = null;
let currentLyricIndex = 0;

function playSong() {
    const lyricsDisplay = document.getElementById('lyricsDisplay');
    const playBtn = document.getElementById('playSongBtn');
    
    if (songInterval) {
        clearInterval(songInterval);
        songInterval = null;
        playBtn.textContent = '▶️ Play Song';
        lyricsDisplay.textContent = 'Click play to start the song!';
        currentLyricIndex = 0;
        return;
    }

    playBtn.textContent = '⏸️ Pause Song';
    currentLyricIndex = 0;

    songInterval = setInterval(() => {
        if (currentLyricIndex < songLyrics.length) {
            lyricsDisplay.innerHTML = `<div class="lyrics-line">${songLyrics[currentLyricIndex]}</div>`;
            currentLyricIndex++;
        } else {
            clearInterval(songInterval);
            songInterval = null;
            playBtn.textContent = '▶️ Play Again';
            
            setTimeout(() => {
                showReflection("Did you like the Kindness Song?");
                recordActivity({
                    type: 'song',
                    name: 'The Kindness Song',
                    completed: true
                });
            }, 1000);
        }
    }, 3000);
}

// Coloring Logic
let coloringCanvas, coloringCtx;
let selectedColor = '#FFD93D';
let isDrawing = false;

function initColoring() {
    coloringCanvas = document.getElementById('coloringCanvas');
    coloringCtx = coloringCanvas.getContext('2d');
    
    coloringCanvas.width = 800;
    coloringCanvas.height = 600;

    // Create color palette
    const colors = ['#FFD93D', '#fd79a8', '#74b9ff', '#55efc4', '#a29bfe', 
                   '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da'];
    const palette = document.getElementById('colorPalette');
    
    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.background = color;
        btn.onclick = () => selectColor(btn, color);
        palette.appendChild(btn);
    });

    // Draw Emmy outline
    drawEmmyOutline();

    // Event listeners
    coloringCanvas.addEventListener('mousedown', startDrawing);
    coloringCanvas.addEventListener('mousemove', draw);
    coloringCanvas.addEventListener('mouseup', stopDrawing);
    coloringCanvas.addEventListener('touchstart', handleTouchStart);
    coloringCanvas.addEventListener('touchmove', handleTouchMove);
    coloringCanvas.addEventListener('touchend', stopDrawing);
}

function selectColor(btn, color) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedColor = color;
}

function drawEmmyOutline() {
    coloringCtx.strokeStyle = '#2d3748';
    coloringCtx.lineWidth = 3;
    
    // Draw simple dove outline (Emmy)
    coloringCtx.font = '200px Arial';
    coloringCtx.strokeText('🕊️', 300, 350);
}

function startDrawing(e) {
    isDrawing = true;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = coloringCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    coloringCtx.fillStyle = selectedColor;
    coloringCtx.beginPath();
    coloringCtx.arc(x, y, 15, 0, Math.PI * 2);
    coloringCtx.fill();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const rect = coloringCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    coloringCtx.fillStyle = selectedColor;
    coloringCtx.beginPath();
    coloringCtx.arc(x, y, 15, 0, Math.PI * 2);
    coloringCtx.fill();
}

function saveColoring() {
    const dataURL = coloringCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-emmy-coloring.png';
    link.href = dataURL;
    link.click();

    showReflection("Great job coloring! Do you like your artwork?");
    recordActivity({
        type: 'coloring',
        name: 'Emmy Coloring',
        completed: true
    });
}

// Activity Management
function showActivity(activityName) {
    // Hide all activities
    document.querySelectorAll('.activity-space').forEach(space => {
        space.classList.remove('active');
    });

    // Show selected activity
    const activity = document.getElementById(activityName);
    activity.classList.add('active');

    // Initialize activity-specific logic
    if (activityName === 'stories' && currentScene === 0) {
        initStory();
    } else if (activityName === 'games' && !gameCanvas) {
        initGame();
    } else if (activityName === 'coloring' && !coloringCanvas) {
        initColoring();
    }
}

// Reflection System
let selectedFeeling = null;

function showReflection(question) {
    document.getElementById('reflectionQuestion').textContent = question;
    document.getElementById('reflectionModal').classList.add('active');
}

function selectFeeling(btn) {
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedFeeling = btn.dataset.feeling;
}

function closeReflection() {
    if (selectedFeeling) {
        document.getElementById('reflectionModal').classList.remove('active');
        selectedFeeling = null;
        updateProgress();
    }
}

// Progress Tracking
function recordActivity(activity) {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": [], "stars": 0}');
    
    progress.activities.push({
        ...activity,
        timestamp: new Date().toISOString(),
        feeling: selectedFeeling
    });
    
    progress.stars += 1;
    
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
}

function updateProgress() {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"stars": 0}');
    const stars = '⭐'.repeat(Math.min(progress.stars, 5)) + '☆'.repeat(Math.max(0, 5 - progress.stars));
    document.getElementById('progressStars').textContent = stars;
}

function getUserId() {
    const user = JSON.parse(localStorage.getItem('emancipation_user') || '{"id": "demo_user"}');
    return user.id;
}

// Sound Effects (simulated)
function playCheerSound() {
    console.log('🎉 Cheer sound!');
}

// Initialize on load
window.addEventListener('load', () => {
    updateProgress();
});