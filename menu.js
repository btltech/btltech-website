document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuBtn || !mobileMenu) {
    return;
  }

  const focusableElements = mobileMenu.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }

    if (e.key === 'Tab' && firstFocusableElement) {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Close menu if clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        if(!mobileMenu.classList.contains('hidden')) {
            closeMenu();
        }
    }
  });
});
