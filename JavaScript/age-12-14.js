/* JavaScript for age-12-14.html - Truth Tribe functionality */

// Menu Navigation
document.querySelectorAll('.tribe-menu button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.tribe-menu button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));

        // Show selected section
        const sectionId = button.dataset.section;
        document.getElementById(sectionId).classList.remove('hidden');
    });
});

// Scenario Click Handlers
document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', () => {
        const scenario = card.dataset.scenario;
        loadScenario(scenario);
    });
});

// Load Scenario into Modal
function loadScenario(scenarioType) {
    const scenarios = {
        party: {
            title: "The Party Dilemma",
            intro: "You arrive at your friend's party. The music is loud, and you notice some older teens in the kitchen with alcohol. Your friend pulls you aside, looking nervous.",
            image: "🎉",
            choices: [
                { text: "Stay and keep an eye on your friend", id: "stay" },
                { text: "Leave immediately and text your parents", id: "leave" },
                { text: "Try to convince your friend to leave with you", id: "convince" },
                { text: "Call a trusted adult for advice", id: "call" }
            ]
        },
        relationship: {
            title: "Relationship Red Flags",
            intro: "Your friend Alex has been dating someone new. Lately, Alex seems withdrawn and always checks their phone nervously. You notice their partner constantly texts asking where they are.",
            image: "❤️‍🩹",
            choices: [
                { text: "Talk to Alex privately about your concerns", id: "talk" },
                { text: "Research warning signs of unhealthy relationships", id: "research" },
                { text: "Suggest Alex speak to a counselor", id: "counselor" },
                { text: "Stay out of it - it's their relationship", id: "ignore" }
            ]
        },
        screenshot: {
            title: "The Screenshot",
            intro: "You hear that someone shared a private photo of a classmate without permission. The photo is spreading through group chats at school.",
            image: "📱",
            choices: [
                { text: "Report it to a trusted adult immediately", id: "report" },
                { text: "Reach out to the person affected to offer support", id: "support" },
                { text: "Refuse to look at or share the image", id: "refuse" },
                { text: "All of the above", id: "all" }
            ]
        }
    };

    const scenario = scenarios[scenarioType] || scenarios.party;
    
    document.getElementById('scenario-content').innerHTML = `
        <div style="text-align: center; font-size: 4rem; margin: 1rem 0;">${scenario.image}</div>
        <h2>${scenario.title}</h2>
        <p style="font-size: 1.1rem; margin: 1.5rem 0; line-height: 1.6;">${scenario.intro}</p>
        <h3 style="margin: 2rem 0 1rem;">What do you do?</h3>
        ${scenario.choices.map(choice => `
            <button class="choice-btn" onclick="makeChoice('${choice.id}', '${scenarioType}')">
                ${choice.text}
            </button>
        `).join('')}
    `;

    document.getElementById('scenario-modal').classList.add('active');
}

function makeChoice(choiceId, scenario) {
    // In production: This would track the choice and update the moral growth tracker
    const outcomes = {
        stay: "You stayed to support your friend. This shows loyalty, but remember to also prioritize your own safety.",
        leave: "You made a safe choice by leaving. It's always okay to remove yourself from uncomfortable situations.",
        convince: "Great leadership! Helping friends make good decisions is what real friendship is about.",
        call: "Excellent decision! Asking for guidance from trusted adults shows maturity.",
        talk: "Perfect approach. Real friends have difficult conversations when they're concerned.",
        report: "You did the right thing. Reporting digital abuse helps protect victims.",
        all: "Outstanding! Taking multiple actions shows comprehensive support and understanding."
    };

    alert(outcomes[choiceId] || "You've made your choice. Every decision teaches us something.");
    
    // Track progress (would connect to progress-tracker.js in production)
    console.log(`Choice made: ${choiceId} in scenario: ${scenario}`);
    
    closeModal();
}

function closeModal() {
    document.getElementById('scenario-modal').classList.remove('active');
}

// Teen Content Form
document.getElementById('teen-content-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for sharing! Your content will be reviewed within 48 hours and posted if approved. Your voice matters!');
    e.target.reset();
});

// Close modal when clicking outside
document.getElementById('scenario-modal').addEventListener('click', (e) => {
    if (e.target.id === 'scenario-modal') {
        closeModal();
    }
});