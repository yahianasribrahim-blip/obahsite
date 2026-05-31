// Mobile nav toggle
// Capture Google Click ID (gclid) on landing so we can attribute the lead
// even after the user navigates around the site before submitting.
(function captureGclid() {
  try {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid');
    if (gclid) {
      sessionStorage.setItem('obah_gclid', gclid);
      sessionStorage.setItem('obah_landing', window.location.href);
    }
  } catch (e) { /* ignore */ }
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Sticky mobile call CTA (visible only on phones via CSS)
  if (!document.querySelector('.mobile-call-cta')) {
    const callBtn = document.createElement('a');
    callBtn.href = 'tel:613-825-7921';
    callBtn.className = 'mobile-call-cta';
    callBtn.setAttribute('aria-label', 'Call Ottawa Barrhaven Animal Hospital');
    callBtn.innerHTML = '<i class="fa-solid fa-phone"></i> Call Now';
    document.body.appendChild(callBtn);
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
        const fd = new FormData(form);
        const gclid = sessionStorage.getItem('obah_gclid') || '';
        const landing = sessionStorage.getItem('obah_landing') || '';
        const referrer = document.referrer || '';
        if (gclid) fd.append('gclid', gclid);
        if (landing) fd.append('landing', landing);
        if (referrer) fd.append('referrer', referrer);
        const res = await fetch('/api/contact', { method: 'POST', body: fd });
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
