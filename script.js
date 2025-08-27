/* Premium interactive JS: smooth scrolling, menu, lightbox, skill animation, theme, cursor */
document.addEventListener('DOMContentLoaded', () => {

  // smooth internal scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // hamburger toggle (mobile)
  const hamburger = document.querySelector('.hamburger');
  hamburger?.addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Lightbox gallery setup
  const galleries = {
    crowd: ['images/project1-1.jpg', 'images/project1-2.jpg'],
    breast: ['images/project2-1.jpg', 'images/project2-2.jpg'],
    ux: ['images/project3-1.jpg'] // add more frames if you have them
  };

  const lightbox = document.getElementById('lightbox');
  const lbTrack = document.querySelector('.lb-track');
  let currentGallery = null;
  let currentIndex = 0;

  function openLightbox(name, index=0){
    currentGallery = galleries[name] || [];
    currentIndex = index;
    renderLightbox();
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lbTrack.innerHTML = '';
  }
  function renderLightbox(){
    lbTrack.innerHTML = '';
    if (!currentGallery || currentGallery.length===0) return;
    const img = document.createElement('img');
    img.src = currentGallery[currentIndex];
    img.alt = 'Project image';
    lbTrack.appendChild(img);
  }

  document.querySelectorAll('.link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-open');
      openLightbox(name, 0);
    });
  });

  document.querySelectorAll('.proj').forEach(p => {
    p.addEventListener('keydown', (e) => { if (e.key==='Enter'){ p.querySelector('.link-btn')?.click(); }});
  });

  document.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lb-prev')?.addEventListener('click', () => {
    if (!currentGallery) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    renderLightbox();
  });
  document.querySelector('.lb-next')?.addEventListener('click', () => {
    if (!currentGallery) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    renderLightbox();
  });

  // click outside to close
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // skill bars animate when visible
  const bars = document.querySelectorAll('.bar');
  const obs = new IntersectionObserver(entries => {
    for (const ent of entries){
      if (ent.isIntersecting){
        const bar = ent.target;
        const value = bar.getAttribute('data-value') || '70';
        bar.querySelector('span').style.width = value + '%';
        obs.unobserve(bar);
      }
    }
  }, {threshold:0.35});
  bars.forEach(b => obs.observe(b));

  // theme toggle (simple)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  function setLight(on){
    if (on){
      root.style.setProperty('--bg','#f7fafc');
      root.style.setProperty('--panel','#ffffff');
      root.style.setProperty('--text','#061021');
      root.style.setProperty('--muted','#4b5563');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme','light');
    } else {
      root.style.removeProperty('--bg');
      root.style.removeProperty('--panel');
      root.style.removeProperty('--text');
      root.style.removeProperty('--muted');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme','dark');
    }
  }
  themeToggle?.addEventListener('click', () => {
    const cur = localStorage.getItem('theme') === 'light';
    setLight(!cur);
  });
  if (localStorage.getItem('theme') === 'light') setLight(true);

  // contact form -> mailto fallback
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message){ alert('Please fill all fields.'); return; }
    const subject = encodeURIComponent(`Portfolio: ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:sathvikakollabathula@gmail.com?subject=${subject}&body=${body}`;
  });

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // custom cursor
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  ['a','button','.proj','.link-btn','.btn'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; cursor.style.opacity = '0.95'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.opacity = '1'; });
  });});

  // keyboard escape closes lightbox
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
    if (e.key === 'ArrowLeft') {
      document.querySelector('.lb-prev')?.click();
    }
    if (e.key === 'ArrowRight') {
      document.querySelector('.lb-next')?.click();
    }
  });

});
