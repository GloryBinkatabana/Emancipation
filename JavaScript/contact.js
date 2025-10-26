/* JavaScript for contact.html - Contact form functionality */

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        type: document.getElementById('type').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for hackathon demo
    // In production: Send to backend API
    const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    contacts.push(formData);
    localStorage.setItem('contact_submissions', JSON.stringify(contacts));
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Reset form
    this.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
});