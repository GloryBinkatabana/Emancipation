/* JavaScript for crisis.html - Crisis resources functionality */

// Toggle resource lists
function toggleResources(topicId) {
    const resourceList = document.getElementById(topicId);
    if (resourceList.style.display === 'none') {
        resourceList.style.display = 'block';
    } else {
        resourceList.style.display = 'none';
    }
}

// Trusted Circle Management
let trustedPersonCount = 1;

function addTrustedPerson() {
    if (trustedPersonCount >= 5) {
        alert('You can add up to 5 trusted adults. If you need more, consider printing this list and adding them separately.');
        return;
    }

    trustedPersonCount++;
    const container = document.getElementById('circleEntries');
    
    const entryHTML = `
        <div class="circle-entry" data-entry="${trustedPersonCount}">
            <h4 style="color: #667eea; margin-bottom: 1rem;">Trusted Adult #${trustedPersonCount}</h4>
            <div class="form-group">
                <label for="name${trustedPersonCount}">Name:</label>
                <input type="text" id="name${trustedPersonCount}" placeholder="e.g., Mr. Smith">
            </div>
            <div class="form-group">
                <label for="relationship${trustedPersonCount}">Relationship:</label>
                <input type="text" id="relationship${trustedPersonCount}" placeholder="e.g., Teacher, Uncle, Pastor">
            </div>
            <div class="form-group">
                <label for="phone${trustedPersonCount}">Phone Number (optional):</label>
                <input type="tel" id="phone${trustedPersonCount}" placeholder="e.g., (555) 123-4567">
            </div>
            <div class="form-group">
                <label for="when${trustedPersonCount}">When to Contact:</label>
                <textarea id="when${trustedPersonCount}" rows="2" placeholder="e.g., When I need advice, when something scary happens"></textarea>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', entryHTML);
}

function saveTrustedCircle() {
    const trustedCircle = [];
    
    for (let i = 1; i <= trustedPersonCount; i++) {
        const name = document.getElementById(`name${i}`).value;
        const relationship = document.getElementById(`relationship${i}`).value;
        const phone = document.getElementById(`phone${i}`).value;
        const when = document.getElementById(`when${i}`).value;
        
        if (name && relationship) {
            trustedCircle.push({
                name: name,
                relationship: relationship,
                phone: phone,
                whenToContact: when
            });
        }
    }
    
    if (trustedCircle.length === 0) {
        alert('Please add at least one trusted adult before saving.');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('trusted_circle', JSON.stringify(trustedCircle));
    
    alert(`✅ Your Trusted Circle has been saved! You've added ${trustedCircle.length} trusted adult(s). You can come back and update this list anytime.`);
}

// Load saved trusted circle on page load
function loadTrustedCircle() {
    const saved = localStorage.getItem('trusted_circle');
    if (saved) {
        const circle = JSON.parse(saved);
        
        // Clear existing entries
        document.getElementById('circleEntries').innerHTML = '';
        trustedPersonCount = 0;
        
        // Add saved entries
        circle.forEach((person, index) => {
            if (index > 0) addTrustedPerson();
            
            const num = index + 1;
            document.getElementById(`name${num}`).value = person.name;
            document.getElementById(`relationship${num}`).value = person.relationship;
            document.getElementById(`phone${num}`).value = person.phone || '';
            document.getElementById(`when${num}`).value = person.whenToContact || '';
        });
    }
}

// Quick exit function
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        window.location.replace('https://www.google.com');
    }
});

// Load saved circle on page load
document.addEventListener('DOMContentLoaded', loadTrustedCircle);

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});