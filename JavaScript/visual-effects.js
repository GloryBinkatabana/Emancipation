/* Visual Effects and Animations for Emancipation Website */

// Particle system for interactive background
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Create initial particles
        this.createParticles();

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(102, 126, 234, 0.3)',
            'rgba(240, 147, 251, 0.3)',
            'rgba(245, 87, 108, 0.3)',
            'rgba(255, 217, 61, 0.3)',
            'rgba(85, 239, 196, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Mouse trail effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });

        this.animate();
    }

    addTrailPoint(x, y) {
        this.trail.push({
            x: x,
            y: y,
            life: 1.0,
            size: Math.random() * 5 + 2
        });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    animate() {
        // Update existing trail points
        this.trail.forEach((point, index) => {
            point.life -= 0.05;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });

        // Create trail elements
        this.trail.forEach((point, index) => {
            const trailElement = document.querySelector(`#trail-${index}`) || this.createTrailElement(index);
            
            trailElement.style.left = point.x + 'px';
            trailElement.style.top = point.y + 'px';
            trailElement.style.opacity = point.life;
            trailElement.style.transform = `scale(${point.life})`;
        });

        requestAnimationFrame(() => this.animate());
    }

    createTrailElement(index) {
        const element = document.createElement('div');
        element.id = `trail-${index}`;
        element.style.position = 'fixed';
        element.style.width = '8px';
        element.style.height = '8px';
        element.style.borderRadius = '50%';
        element.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.6), transparent)';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '999';
        element.style.transition = 'all 0.1s ease';
        document.body.appendChild(element);
        return element;
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Find elements to animate
        this.elements = document.querySelectorAll('.hub-card, .feature-card, .impact-card, .value-badge');
        
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'bounceIn 0.6s ease forwards';
                    entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                }
            });
        }, { threshold: 0.1 });

        // Observe elements
        this.elements.forEach(element => {
            element.style.opacity = '0';
            this.observer.observe(element);
        });
    }
}

// Interactive hover effects
class InteractiveEffects {
    constructor() {
        this.init();
    }

    init() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn, .age-card, .hub-card').forEach(element => {
            element.addEventListener('click', this.createRipple);
        });

        // Add magnetic effect to floating elements
        document.querySelectorAll('.emmy-float-button, .shape').forEach(element => {
            element.addEventListener('mousemove', this.magneticEffect);
            element.addEventListener('mouseleave', this.resetMagnetic);
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    magneticEffect(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    }

    resetMagnetic(e) {
        const element = e.currentTarget;
        element.style.transform = 'translate(0, 0)';
    }
}

// Typing animation for text
class TypingAnimation {
    constructor() {
        this.init();
    }

    init() {
        const textElements = document.querySelectorAll('[data-typing]');
        textElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            this.typeText(element, text, 50);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-mobile devices for performance
    if (window.innerWidth > 768) {
        new ParticleSystem();
        new MouseTrail();
    }
    
    new ScrollAnimations();
    new InteractiveEffects();
    
    // Add typing animation to specific elements
    setTimeout(() => {
        new TypingAnimation();
    }, 1000);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
        }
        50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
        }
        70% {
            transform: scale(0.9) translateY(0);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(style);