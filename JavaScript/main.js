/* Main JavaScript file for Emancipation website */
/* Common functions used across multiple pages */

// Common utility functions
function getUserId() {
    const user = JSON.parse(localStorage.getItem('emancipation_user') || '{"id": "demo_user"}');
    return user.id;
}

// Progress tracking function used across age-specific pages
function recordActivity(activity) {
    const userId = getUserId();
    let progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{"activities": []}');
    
    progress.activities.push({
        ...activity,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
}

// Common animation functions
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

// Smooth scroll function for anchor links
function initSmoothScroll() {
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
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    
    // Initialize any counters on the page
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    if (target) {
                        animateCounter(counter, target);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe counter sections
    const counterSections = document.querySelectorAll('.impact-counter, .counter-section');
    counterSections.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });
});

// Common modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Form validation helper
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f5576c';
            isValid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#667eea',
        success: '#55efc4',
        warning: '#FFD93D',
        error: '#f5576c'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Age verification and routing
function checkAgeAccess(requiredAge) {
    const userAge = loadFromStorage('user_age');
    if (!userAge || userAge < requiredAge) {
        showNotification('Please verify your age to access this content', 'warning');
        return false;
    }
    return true;
}

// Progress tracking across all age groups
function updateGlobalProgress(activity) {
    const globalProgress = loadFromStorage('global_progress', {
        totalActivities: 0,
        totalTime: 0,
        badgesEarned: 0,
        streakDays: 0,
        lastActivity: null
    });
    
    globalProgress.totalActivities++;
    globalProgress.totalTime += activity.duration || 0;
    globalProgress.lastActivity = new Date().toISOString();
    
    // Check for streak
    const lastDate = globalProgress.lastActivity ? new Date(globalProgress.lastActivity).toDateString() : null;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastDate === yesterday) {
        globalProgress.streakDays++;
    } else if (lastDate !== today) {
        globalProgress.streakDays = 1;
    }
    
    saveToStorage('global_progress', globalProgress);
    return globalProgress;
}

// Export functions for use in other files
window.EmancipationUtils = {
    getUserId,
    recordActivity,
    animateCounter,
    openModal,
    closeModal,
    validateForm,
    saveToStorage,
    loadFromStorage,
    showNotification,
    checkAgeAccess,
    updateGlobalProgress
};