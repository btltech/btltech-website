// Enhanced JavaScript functionality for BTLTech website

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      const icon = menuBtn.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fa-solid fa-bars';
      } else {
        icon.className = 'fa-solid fa-times';
      }
    });
  }
  
  // Update copyright year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Smooth scrolling for anchor links
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

// Form validation and enhancement
function enhanceForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add real-time validation
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Add loading state to submit button
      form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Submitting...';
          submitBtn.disabled = true;
        }
      });
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let isValid = true;
  let message = '';
  
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'This field is required';
  } else if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
  } else if (type === 'tel' && value) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  
  // Show/hide error message
  let errorElement = field.parentNode.querySelector('.error-message');
  if (!isValid) {
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message text-red-500 text-sm mt-1';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    field.classList.add('border-red-500');
    field.classList.remove('border-gray-300');
  } else {
    if (errorElement) {
      errorElement.remove();
    }
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');
  }
  
  return isValid;
}

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Performance monitoring
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
          
          // Track Core Web Vitals
          if ('web-vital' in window) {
            // This would integrate with web-vitals library
            console.log('Core Web Vitals tracked');
          }
        }
      }, 0);
    });
  }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
  enhanceForms();
  initScrollAnimations();
  trackPerformance();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-fade-in {
    animation: fadeIn 0.6s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .error-message {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);