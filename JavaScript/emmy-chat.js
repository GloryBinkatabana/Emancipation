/* Emmy Chat Page JavaScript */

// Welcome modal functions
function showWelcomeModal() {
    document.getElementById('welcome-modal').style.display = 'flex';
}

function closeWelcomeModal() {
    document.getElementById('welcome-modal').style.display = 'none';
}

// Show welcome modal for first-time users
document.addEventListener('DOMContentLoaded', () => {
    const hasVisited = localStorage.getItem('emmy-visited');
    if (!hasVisited) {
        setTimeout(showWelcomeModal, 2000);
        localStorage.setItem('emmy-visited', 'true');
    }
});