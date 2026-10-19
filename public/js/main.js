// ClimateNow — main.js

// Toggle senha no login
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-pwd');
  const passwordInput = document.getElementById('password');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isText = passwordInput.type === 'text';
      passwordInput.type = isText ? 'password' : 'text';
    });
  }

  // Auto-hide alerts
  setTimeout(() => {
    document.querySelectorAll('.alert').forEach(el => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
    });
  }, 5000);

  // Animação de entrada nos cards
  const cards = document.querySelectorAll('.post-card, .stat-card, .weather-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });
});
