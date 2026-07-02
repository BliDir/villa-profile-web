import { t } from './i18n.js';

export function initForm() {
  const form = document.getElementById('inquire-form');
  if (!form) return;

  const checkinInput  = form.querySelector('[name="checkin"]');
  const checkoutInput = form.querySelector('[name="checkout"]');
  const textarea      = form.querySelector('[name="message"]');
  const counter       = form.querySelector('.inquire__char-count');
  const submitBtn     = form.querySelector('[type="submit"]');

  // ── Date constraints ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  checkinInput.min  = today;
  checkoutInput.min = today;

  checkinInput.addEventListener('change', () => {
    const next = checkinInput.value || today;
    checkoutInput.min = next;
    if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
      checkoutInput.value = '';
      setFieldError(checkoutInput, '');
    }
  });

  // ── Blur / input validation ───────────────────────────────────────────────────
  form.querySelectorAll('input[required], select[required]').forEach(el => {
    el.addEventListener('blur',  () => { validateField(el); updateSubmitState(form, submitBtn); });
    el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) validateField(el); updateSubmitState(form, submitBtn); });
    el.addEventListener('change',() => { validateField(el); updateSubmitState(form, submitBtn); });
  });

  // ── Char counter ──────────────────────────────────────────────────────────────
  if (textarea && counter) {
    const update = () => {
      const remaining = 500 - textarea.value.length;
      counter.textContent = `${remaining} ${t('form.chars_remaining')}`;
    };
    update();
    textarea.addEventListener('input', update);
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  form.addEventListener('submit', e => handleSubmit(e, submitBtn));
}

function validateField(el) {
  const value = el.value.trim();
  let error = '';

  if (el.required && !value) {
    error = t('form.err_required');
  } else if (el.name === 'email' && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('form.err_email');
  } else if (el.name === 'checkout') {
    const checkin = el.closest('form').querySelector('[name="checkin"]').value;
    if (value && checkin && value <= checkin) error = t('form.err_checkout');
  }

  setFieldError(el, error);
  return !error;
}

function setFieldError(el, message) {
  el.classList.toggle('is-invalid', !!message);
  const errorEl = el.closest('.inquire__field')?.querySelector('.inquire__error');
  if (errorEl) errorEl.textContent = message;
}

function updateSubmitState(form, btn) {
  const allFilled  = [...form.querySelectorAll('[required]')].every(el => el.value.trim());
  const noErrors   = !form.querySelector('.is-invalid');
  btn.disabled = !(allFilled && noErrors);
}

async function handleSubmit(e, btn) {
  e.preventDefault();
  const form = e.target;

  let valid = true;
  form.querySelectorAll('[required]').forEach(el => { if (!validateField(el)) valid = false; });
  if (!valid) return;

  const formError = form.querySelector('.inquire__form-error');
  if (formError) formError.hidden = true;

  const originalLabel = btn.querySelector('[data-i18n]')?.textContent ?? btn.textContent;
  btn.disabled = true;
  btn.textContent = '…';

  const data = Object.fromEntries(new FormData(form));

  try {
    // SWAP: replace REPLACE_FORM_ID with your Formspree form ID (https://formspree.io)
    const res = await fetch('https://formspree.io/f/REPLACE_FORM_ID', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body   : JSON.stringify(data),
    });

    if (res.ok) {
      showSuccess(form);
    } else {
      showError(form, btn, originalLabel);
    }
  } catch {
    showError(form, btn, originalLabel);
  }
}

function showSuccess(form) {
  const wrap = form.closest('.inquire__form-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="inquire__success">
      <div class="inquire__success-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3>${t('form.success_heading')}</h3>
      <p>${t('form.success')}</p>
    </div>
  `;
}

function showError(form, btn, originalLabel) {
  const formError = form.querySelector('.inquire__form-error');
  if (formError) {
    formError.textContent = t('form.error');
    formError.hidden = false;
  }
  btn.disabled = false;
  btn.textContent = originalLabel;
}
