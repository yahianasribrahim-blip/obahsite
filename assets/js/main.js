// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Scroll to top button
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Hero slide rotation (if hero has data-slides)
  const hero = document.querySelector('.hero[data-slides]');
  if (hero) {
    const slides = hero.dataset.slides.split(',').map(s => s.trim());
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      hero.style.backgroundImage = `url('${slides[idx]}')`;
    }, 5000);
  }

  // Contact form submission
  const form = document.getElementById('contact-form');
  if (form) {
    const submit = document.getElementById('contact-submit');
    const status = document.getElementById('form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submit.disabled = true;
      const originalText = submit.innerHTML;
      submit.innerHTML = 'Sending...';
      status.style.display = 'none';
      try {
        const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          window.location.href = '/thanks';
          return;
        }
        status.textContent = data.error || 'Something went wrong. Please call us at 613-825-7921.';
        status.style.color = '#c0392b';
        status.style.display = 'block';
        submit.disabled = false;
        submit.innerHTML = originalText;
      } catch (err) {
        status.textContent = 'Network error. Please call us at 613-825-7921.';
        status.style.color = '#c0392b';
        status.style.display = 'block';
        submit.disabled = false;
        submit.innerHTML = originalText;
      }
    });
  }
});
