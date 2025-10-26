/* JavaScript for parent-dashboard.html - Parent dashboard functionality */

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Show selected tab content
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

// Child selector change handler
document.getElementById('child-select').addEventListener('change', (e) => {
    const childId = e.target.value;
    console.log('Loading data for child:', childId);
    // In production: This would load different child's data via API
    alert(`Loading progress data for ${e.target.options[e.target.selectedIndex].text}`);
});

// Animate skill bars on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.skill-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
});