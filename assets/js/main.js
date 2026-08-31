(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const modal = document.querySelector('[data-modal]');
  const modalImage = document.querySelector('[data-modal-image]');
  const modalCaption = document.querySelector('[data-modal-caption]');
  const modalClose = document.querySelector('[data-modal-close]');
  let lastFocused = null;

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.setAttribute('inert', '');
    mobileNav.classList.remove('is-open');
  };

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
      mobileNav.setAttribute('aria-hidden', String(!willOpen));
      if (willOpen) mobileNav.removeAttribute('inert');
      else mobileNav.setAttribute('inert', '');
      mobileNav.classList.toggle('is-open', willOpen);
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  const revealItems = document.querySelectorAll('.reveal');
  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty('--delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (modalImage) {
      modalImage.removeAttribute('src');
      modalImage.alt = '';
    }
    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  };

  const openModal = (trigger) => {
    if (!modal || !modalImage || !modalCaption) return;
    const imageUrl = trigger.dataset.image;
    if (!imageUrl) return;
    lastFocused = trigger;
    modalImage.src = imageUrl;
    modalImage.alt = trigger.dataset.caption || '拡大画像';
    modalCaption.textContent = trigger.dataset.caption || '';
    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modalClose?.focus());
  };

  document.querySelectorAll('[data-image]').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger));
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      closeMenu();
    }
  });

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
