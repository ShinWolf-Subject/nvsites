// Enhanced JavaScript functionality
class MinecraftArchives {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavbar();
    this.setupMenuButton();
    this.setupScrollAnimations();
    this.setupLauncherItems();
    this.setupSearch();
    this.simulateLoading();
  }

  // Navbar scroll effects
  setupNavbar() {
    // Removed auto-hide functionality - navbar stays visible
  }

  // Animated menu button
  setupMenuButton() {
    const menuButton = document.querySelector('.menu-button');
    const navbarCollapse = document.querySelector('#navbarNav');

    if (menuButton) {
      menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
          menuButton.classList.remove('active');
        }
      });
    }
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // Launcher item interactions
  setupLauncherItems() {
    const launcherItems = document.querySelectorAll('.launcher-item');

    launcherItems.forEach((item, index) => {
      // Staggered animation
      item.style.animationDelay = `${(index * 0.1) + 1.2}s`;

      // Hover effects
      item.addEventListener('mouseenter', () => {
        this.createParticleEffect(item);
      });

      // Click ripple effect
      item.addEventListener('click', (e) => {
        this.createRippleEffect(e, item);
      });
    });
  }

  // Particle effect on hover
  createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 6;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-accent);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 1.5s ease-out forwards;
            left: ${Math.random() * rect.width}px;
            top: ${Math.random() * rect.height}px;
            z-index: 1000;
          `;

      element.appendChild(particle);

      setTimeout(() => particle.remove(), 1500);
    }
  }

  // Ripple effect on click
  createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(0, 212, 255, 0.3);
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Search functionality - works for both inputs
  setupSearch() {
    const searchInputs = document.querySelectorAll('#searchInput, #searchInput2');
    const launcherItems = document.querySelectorAll('.launcher-item');

    searchInputs.forEach(searchInput => {
      if (!searchInput) return;

      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        // Sync all search inputs
        searchInputs.forEach(input => {
          if (input !== e.target) {
            input.value = e.target.value;
          }
        });

        launcherItems.forEach(item => {
          const launcherName = item.querySelector('.launcher-name').textContent.toLowerCase();
          const launcherDescription = item.querySelector('.launcher-description').textContent.toLowerCase();

          const nameElement = item.querySelector('.launcher-name');
          const descriptionElement = item.querySelector('.launcher-description');

          // Reset previous highlights
          this.removeHighlights(nameElement);
          this.removeHighlights(descriptionElement);
          item.classList.remove('highlighted', 'hidden');

          if (searchTerm === '') {
            // Show all items when search is empty
            item.style.display = 'block';
          } else if (launcherName.includes(searchTerm) || launcherDescription.includes(searchTerm)) {
            // Show and highlight matching items
            item.style.display = 'block';
            item.classList.add('highlighted');

            // Highlight matching text
            if (launcherName.includes(searchTerm)) {
              this.highlightText(nameElement, searchTerm);
            }
            if (launcherDescription.includes(searchTerm)) {
              this.highlightText(descriptionElement, searchTerm);
            }
          } else {
            // Hide non-matching items
            item.style.display = 'none';
            item.classList.add('hidden');
          }
        });

        // Show "no results" message if no items are visible
        this.toggleNoResultsMessage(searchTerm);
      });

      // Clear search on escape
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInputs.forEach(input => input.value = '');
          searchInput.dispatchEvent(new Event('input'));
          searchInput.blur();
        }
      });
    });
  }

  // Highlight matching text
  highlightText(element, searchTerm) {
    const originalText = element.dataset.originalText || element.textContent;
    if (!element.dataset.originalText) {
      element.dataset.originalText = originalText;
    }

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
    const highlightedText = originalText.replace(regex, '<span class="search-highlight">$1</span>');

    // Only update innerHTML for text content, preserve other elements
    const textNode = element.childNodes[0];
    if (textNode && textNode.nodeType === 3) {
      element.innerHTML = element.innerHTML.replace(originalText, highlightedText);
    }
  }

  // Remove highlights
  removeHighlights(element) {
    if (element.dataset.originalText) {
      const iconHtml = element.querySelector('.launcher-icon') ? element.querySelector('.launcher-icon').outerHTML : '';
      const originalText = element.dataset.originalText;
      element.innerHTML = iconHtml ? iconHtml + originalText.replace(iconHtml, '') : originalText;
    }
  }

  // Escape special regex characters
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Show/hide no results message
  toggleNoResultsMessage(searchTerm) {
    const visibleItems = document.querySelectorAll('.launcher-item:not(.hidden)').length;
    let noResultsMsg = document.getElementById('noResultsMessage');

    if (searchTerm && visibleItems === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMessage';
        noResultsMsg.className = 'text-center py-5';
        noResultsMsg.innerHTML = `
          <i class="fas fa-search text-secondary mb-3" style="font-size: 3rem; opacity: 0.3;"></i>
          <h4 class="text-secondary">No launchers found</h4>
          <p class="text-secondary">Try adjusting your search terms</p>
        `;
        document.querySelector('.launcher-grid').appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }
  simulateLoading() {
    const links = document.querySelectorAll('.launcher-link.loading');

    links.forEach((link, index) => {
      setTimeout(() => {
        link.classList.remove('loading');
        link.href = '#'; // Add actual download URLs here

        // Add success animation
        link.style.animation = 'linkReady 0.5s ease-out';
      }, (index * 200) + 2000);
    });
  }
}

// CSS animations for JavaScript effects
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px) scale(0);
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  @keyframes linkReady {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bs-body-bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-accent);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-accent);
  }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new MinecraftArchives();
});

// Smooth scroll for internal links
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

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menuButton = document.querySelector('.menu-button');
    const navbarCollapse = document.querySelector('#navbarNav');

    if (menuButton && menuButton.classList.contains('active')) {
      menuButton.classList.remove('active');
      navbarCollapse.classList.remove('show');
    }
  }
});