/* JavaScript for impact.html - Impact page functionality */

// Animated Counter
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Initialize counters when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.counter-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
            observer.disconnect();
        }
    });
}, observerOptions);

// Observe the counter section
const counterSection = document.querySelector('.impact-counter');
if (counterSection) {
    observer.observe(counterSection);
}

// Challenge Progress Animation
function animateChallengeProgress() {
    const progressBar = document.getElementById('challengeProgress');
    const targetPercent = 63; // 63% completion
    let currentPercent = 0;

    const interval = setInterval(() => {
        currentPercent += 1;
        progressBar.style.width = currentPercent + '%';
        progressBar.textContent = currentPercent + '%';

        if (currentPercent >= targetPercent) {
            clearInterval(interval);
        }
    }, 30);
}

// Animate progress when section comes into view
const challengeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateChallengeProgress();
            challengeObserver.disconnect();
        }
    });
}, observerOptions);

const challengeSection = document.querySelector('.monthly-challenge');
if (challengeSection) {
    challengeObserver.observe(challengeSection);
}

// Join Challenge Function
function joinChallenge() {
    const user = localStorage.getItem('emancipation_user');
    if (!user) {
        alert('Please create an account to join challenges!');
        window.location.href = 'index.html';
        return;
    }

    // Store challenge participation
    const challenges = JSON.parse(localStorage.getItem('user_challenges') || '[]');
    challenges.push({
        name: 'Respect Week',
        joinedDate: new Date().toISOString(),
        progress: 0,
        completed: false
    });
    localStorage.setItem('user_challenges', JSON.stringify(challenges));

    alert('🎉 You\'ve joined Respect Week! Complete 5 respect-focused activities to earn your certificate.');
}

// Leaderboard Data
const leaderboardData = {
    schools: [
        { rank: 1, name: 'Riverside Elementary', score: 2345, metric: 'badges' },
        { rank: 2, name: 'Oakwood Academy', score: 2103, metric: 'badges' },
        { rank: 3, name: 'Sunnydale School', score: 1876, metric: 'badges' },
        { rank: 4, name: 'Lincoln Middle School', score: 1654, metric: 'badges' },
        { rank: 5, name: 'Harmony High', score: 1432, metric: 'badges' },
        { rank: 6, name: 'Valley View Elementary', score: 1289, metric: 'badges' },
        { rank: 7, name: 'Maple Grove School', score: 1156, metric: 'badges' },
        { rank: 8, name: 'Westside Academy', score: 1043, metric: 'badges' },
        { rank: 9, name: 'East Park School', score: 967, metric: 'badges' },
        { rank: 10, name: 'Central Elementary', score: 892, metric: 'badges' }
    ],
    heroes: [
        { rank: 1, name: 'KindnessKid_47', score: 2850, metric: 'impact points' },
        { rank: 2, name: 'RespectChamp99', score: 2634, metric: 'impact points' },
        { rank: 3, name: 'EmpathyQueen_21', score: 2401, metric: 'impact points' },
        { rank: 4, name: 'CourageHero_88', score: 2198, metric: 'impact points' },
        { rank: 5, name: 'SafetyGuardian_12', score: 2076, metric: 'impact points' },
        { rank: 6, name: 'InclusionStar_55', score: 1943, metric: 'impact points' },
        { rank: 7, name: 'TruthSeeker_33', score: 1821, metric: 'impact points' },
        { rank: 8, name: 'AllyAdvocate_77', score: 1709, metric: 'impact points' },
        { rank: 9, name: 'PeaceMaker_44', score: 1598, metric: 'impact points' },
        { rank: 10, name: 'JusticeLeader_66', score: 1487, metric: 'impact points' }
    ],
    communities: [
        { rank: 1, name: 'Springfield Community', score: '87%', metric: 'participation' },
        { rank: 2, name: 'Riverside District', score: '82%', metric: 'participation' },
        { rank: 3, name: 'Westview Neighborhood', score: '78%', metric: 'participation' },
        { rank: 4, name: 'Oakdale Region', score: '74%', metric: 'participation' },
        { rank: 5, name: 'Central Valley', score: '71%', metric: 'participation' },
        { rank: 6, name: 'East Side Community', score: '68%', metric: 'participation' },
        { rank: 7, name: 'North Park District', score: '65%', metric: 'participation' },
        { rank: 8, name: 'South Hills Region', score: '62%', metric: 'participation' },
        { rank: 9, name: 'Metro Area', score: '59%', metric: 'participation' },
        { rank: 10, name: 'Harbor District', score: '56%', metric: 'participation' }
    ]
};

// Show Leaderboard Function
function showLeaderboard(type) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const content = document.getElementById('leaderboardContent');
    const data = leaderboardData[type];

    let tableHTML = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(entry => {
        const rankClass = entry.rank <= 3 ? `rank-${entry.rank}` : '';
        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';
        
        tableHTML += `
            <tr>
                <td class="rank ${rankClass}">
                    ${medal ? `<span class="rank-medal">${medal}</span>` : entry.rank}
                </td>
                <td>${entry.name}</td>
                <td class="score">${typeof entry.score === 'number' ? entry.score.toLocaleString() : entry.score} ${entry.metric}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    content.innerHTML = tableHTML;
}

// Initialize with schools leaderboard
document.addEventListener('DOMContentLoaded', () => {
    showLeaderboard('schools');
});