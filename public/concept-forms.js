(() => {
  const contact = document.querySelector('.modal-contact');
  const newsletter = document.querySelector('.modal-subscribe');
  const newsletterLayout = newsletter?.querySelector('.modal-subscribe_layout');
  const newsletterSuccess = newsletter?.querySelector('.modal-subscribe-success');
  const newsletterForm = newsletter?.querySelector('[data-mc-form="subscribe"]');
  const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
  const demoMessage = 'This is a concept preview. Your information was not sent or saved.';
  let activeModal = null;
  let opener = null;
  let bodyOverflow = '';
  let newsletterCloseTimer;

  function setupDialog(modal, label) {
    if (!modal) return;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', label);
    modal.setAttribute('data-lenis-prevent', '');
    modal.querySelectorAll('.modal-close').forEach((button) => button.setAttribute('aria-label', 'Close'));
  }

  setupDialog(contact, 'Let’s Be in Touch');
  setupDialog(newsletter, 'Stay Inspired');

  if (newsletterLayout && newsletterSuccess) {
    newsletter.style.transition = `opacity ${fadeDuration}ms ease`;
    newsletterLayout.style.transition = `transform ${fadeDuration}ms ease`;
    newsletterSuccess.style.transition = `opacity ${fadeDuration}ms ease`;
    newsletterSuccess.querySelector('.success-before-title').textContent = 'Preview Complete';
    newsletterSuccess.querySelector('.success-title').textContent = 'Newsletter Form Preview';
    newsletterSuccess.querySelector('.success-subtitle').textContent = demoMessage;
  }

  function open(modal, trigger) {
    if (!modal || activeModal) return;
    activeModal = modal;
    opener = trigger;
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (modal === newsletter && newsletterLayout) {
      clearTimeout(newsletterCloseTimer);
      modal.style.display = 'flex';
      modal.style.opacity = '0';
      newsletterLayout.style.transform = 'translateY(1.5rem)';
      void modal.offsetHeight;
      modal.style.opacity = '1';
      newsletterLayout.style.transform = 'none';
    } else {
      modal.classList.add('is-active');
    }

    const visibleClose = Array.from(modal.querySelectorAll('.modal-close')).find((button) => button.getClientRects().length);
    visibleClose?.focus({ preventScroll: true });
  }

  function close() {
    const modal = activeModal;
    if (!modal) return;
    activeModal = null;
    document.body.style.overflow = bodyOverflow;

    if (modal === newsletter && newsletterLayout) {
      modal.style.opacity = '0';
      newsletterLayout.style.transform = 'translateY(1.5rem)';
      newsletterCloseTimer = setTimeout(() => {
        modal.style.display = 'none';
        newsletterLayout.style.display = '';
        newsletterSuccess?.classList.remove('is-active');
        newsletterForm?.reset();
      }, fadeDuration);
    } else {
      modal.classList.remove('is-active');
    }

    opener?.focus({ preventScroll: true });
    opener = null;
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('.open-modal-content, .open-modal-subscribe');
    if (trigger) {
      event.preventDefault();
      const modal = trigger.matches('.open-modal-content') ? contact : newsletter;
      open(modal, event.target.closest('a, button') || trigger.querySelector('a, button'));
      return;
    }

    const isClose = event.target.closest('.modal-close');
    const isNewsletterBackdrop = activeModal === newsletter && newsletter?.contains(event.target)
      && !newsletterLayout?.contains(event.target) && !newsletterSuccess?.contains(event.target);

    if (activeModal && ((isClose && activeModal.contains(isClose)) || isNewsletterBackdrop)) {
      event.preventDefault();
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(activeModal.querySelectorAll('a[href], button, input, textarea, select'))
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
    const edge = event.shiftKey ? focusable[0] : focusable.at(-1);
    if (edge && (document.activeElement === edge || !activeModal.contains(document.activeElement))) {
      event.preventDefault();
      const next = event.shiftKey ? focusable.at(-1) : focusable[0];
      next.focus();
    }
  });

  const contactRules = [
    ['first_name', (value) => value.length >= 2, 'Please enter your first name.'],
    ['last_name', (value) => value.length >= 2, 'Please enter your last name.'],
    ['email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value), 'Please enter a valid email address.'],
    ['phone', (value) => value.replace(/[^\d+]/g, '').length >= 7, 'Please enter a valid phone number.'],
  ];

  function setFieldError(input, message) {
    const field = input.closest('.field');
    const feedback = field?.querySelector('.error-message');
    field?.classList.toggle('is-invalid', Boolean(message));
    if (feedback) feedback.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function createStatus(form) {
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.hidden = true;
    status.style.marginTop = '1rem';
    form.append(status);
    return status;
  }

  document.querySelectorAll('form.sf-form').forEach((form) => {
    const previewRow = form.querySelector('.field--full:not(.field--message)');
    if (previewRow && !previewRow.querySelector('input, textarea, select, .g-recaptcha')) {
      const notice = document.createElement('p');
      notice.textContent = 'Concept preview. This form uses local validation only.';
      Object.assign(notice.style, {
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        width: 'min(100%, 304px)',
        minHeight: '78px',
        margin: '.25rem 0 0',
        padding: '.75rem',
        border: '1px solid #ecf0f8',
        borderRadius: '.25rem',
        background: '#ecf0f833',
        fontSize: '.875rem',
      });
      previewRow.prepend(notice);
    }

    const checks = [];
    for (const [name, isValid, message] of contactRules) {
      const input = form.elements.namedItem(name);
      if (!input) continue;
      const check = () => {
        const passes = isValid(input.value.trim());
        setFieldError(input, passes ? '' : message);
        return passes;
      };
      input.addEventListener('blur', check);
      input.addEventListener('input', () => setFieldError(input, ''));
      checks.push({ input, check });
    }

    const status = createStatus(form);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.hidden = true;
      const invalid = checks.filter(({ check }) => !check());
      if (invalid.length) {
        invalid[0].input.focus();
        return;
      }
      form.reset();
      status.hidden = false;
      status.textContent = demoMessage;
    });
  });

  document.querySelectorAll('form[data-mc-form="subscribe"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      if (form === newsletterForm && newsletterLayout && newsletterSuccess) {
        newsletterLayout.style.display = 'none';
        newsletterSuccess.style.opacity = '0';
        newsletterSuccess.classList.add('is-active');
        void newsletterSuccess.offsetHeight;
        newsletterSuccess.style.opacity = '1';
        newsletterSuccess.querySelector('.modal-close')?.focus({ preventScroll: true });
        return;
      }
      const status = form.parentElement.querySelector('[data-mc-element="success"]');
      if (!status) return;
      status.setAttribute('role', 'status');
      status.textContent = demoMessage;
      status.style.display = 'block';
      form.style.display = 'none';
    });
  });

  document.querySelectorAll('form[action="/forms/demo"]:not(.sf-form, [data-mc-form="subscribe"])').forEach((form) => {
    const wrapper = form.closest('.w-form');
    const done = wrapper?.querySelector('.w-form-done');
    const status = done || createStatus(form);
    const guide = done?.querySelector('[ga-label="Lead magnet: PDF Download"]');
    if (guide) {
      guide.href = '/assets/led-wall-guide.pdf';
      guide.download = 'blue-square-x-led-wall-guide.pdf';
      const [heading, detail] = done.querySelectorAll('.success-block p');
      if (heading) heading.textContent = 'Your guide is ready';
      if (detail) detail.textContent = demoMessage;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      status.setAttribute('role', 'status');
      if (!guide) {
        const message = status.querySelector('.success-text') || status.firstElementChild || status;
        message.textContent = demoMessage;
      }
      if (done) {
        form.style.display = 'none';
        status.style.display = 'block';
        status.tabIndex = -1;
        status.focus({ preventScroll: true });
      } else {
        status.hidden = false;
      }
    });
  });
})();
