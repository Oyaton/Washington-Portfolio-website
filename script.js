document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
            }
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form elements
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const subjectInput = this.querySelector('input[name="subject"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            const submitButton = this.querySelector('button[type="submit"]');

            // Clear previous error messages
            clearFormErrors();

            // Get form values
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim()
            };

            // Client-side validation
            let hasErrors = false;

            if (!formData.name) {
                showFieldError(nameInput, 'Name is required');
                hasErrors = true;
            }

            if (!formData.email) {
                showFieldError(emailInput, 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(formData.email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                hasErrors = true;
            }

            if (!formData.message) {
                showFieldError(messageInput, 'Message is required');
                hasErrors = true;
            }

            if (hasErrors) return;

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                // Send to Azure Function (adjust URL for your deployment)
                const response = await fetch('/api/contactForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessMessage(result.message);
                    this.reset();
                } else {
                    showErrorMessage(result.error || 'An error occurred. Please try again.');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage('Network error. Please check your connection and try again.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }

    // Helper functions for form validation and feedback
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9em';
        errorDiv.style.marginTop = '5px';

        field.style.borderColor = '#e74c3c';
        field.parentNode.appendChild(errorDiv);
    }

    function clearFormErrors() {
        const errors = document.querySelectorAll('.field-error');
        errors.forEach(error => error.remove());

        const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });

        const messages = document.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());
    }

    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        `;

        const form = document.querySelector('.contact-form');
        form.insertBefore(messageDiv, form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => messageDiv.remove(), 5000);
    }

    function showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message error-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        `;

        const form = document.querySelector('.contact-form');
        form.insertBefore(messageDiv, form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => messageDiv.remove(), 5000);
    }
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-item, .project-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.skill-item, .project-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});