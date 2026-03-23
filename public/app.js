(function () {
  const config = window.SWISSTARGET_CONFIG || {};
  const appUrl = config.appUrl || "https://app.myswisstarget.ch";
  document.querySelectorAll('.app-link').forEach((link) => {
    link.setAttribute('href', appUrl);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('package')) {
    const wanted = params.get('package') === 'pro' ? 'basis_pro' : 'basis';
    const radio = document.querySelector(`input[name="plan"][value="${wanted}"]`);
    if (radio) radio.checked = true;
  }

  initChoiceCards();
  initOrderForm(config);

  function initChoiceCards() {
    document.querySelectorAll('.choice-card input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        document.querySelectorAll(`input[name="${input.name}"]`).forEach((item) => {
          item.closest('.choice-card')?.classList.toggle('active-choice', item.checked);
        });
        updateSummary();
      });
    });
    updateSummary();
  }

  function updateSummary() {
    const plan = document.querySelector('input[name="plan"]:checked')?.value || 'basis';
    const payment = document.querySelector('input[name="payment_method"]:checked')?.value || 'invoice';
    const planMap = {
      basis: { label: 'SwissTarget Verein', price: 'CHF 25' },
      basis_pro: { label: 'SwissTarget Verein + Pro', price: 'CHF 35' }
    };
    const paymentMap = {
      invoice: 'Rechnung',
      twint: 'TWINT',
      card: 'Karte'
    };
    setText('summary-plan', planMap[plan].label);
    setText('summary-price', planMap[plan].price);
    setText('summary-total', planMap[plan].price);
    setText('summary-payment', paymentMap[payment]);
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function initOrderForm(cfg) {
    const form = document.getElementById('order-form');
    if (!form) return;

    const messageEl = document.getElementById('order-message');
    const submitBtn = document.getElementById('submit-order-btn');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      updateSummary();
      clearMessage();

      if (!form.reportValidity()) {
        showMessage('Bitte fülle alle Pflichtfelder aus.', 'error');
        return;
      }

      const data = formToObject(form);
      data.monthly_price_chf = data.plan === 'basis_pro' ? 35 : 25;
      data.payment_label = paymentLabel(data.payment_method);
      data.plan_label = data.plan === 'basis_pro' ? 'SwissTarget Verein + Pro' : 'SwissTarget Verein';

      submitBtn.disabled = true;
      submitBtn.textContent = 'Bestellung wird verarbeitet ...';

      try {
        const response = await submitOrder(data, cfg);
        handleOrderResponse(response, data, cfg);
      } catch (error) {
        showMessage(error.message || 'Die Bestellung konnte nicht verarbeitet werden.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Jetzt bestellen';
      }
    });

    const status = params.get('status');
    if (status === 'success') {
      showMessage('Die Bestellung wurde erfolgreich übermittelt. Wir haben deinen Verein erhalten.', 'success');
    }
    if (status === 'cancel') {
      showMessage('Der Zahlungsvorgang wurde abgebrochen. Du kannst die Bestellung erneut starten.', 'warning');
    }
  }

  async function submitOrder(data, cfg) {
    const endpoint = chooseEndpoint(data.payment_method, cfg);
    if (!endpoint) {
      const fallback = storeDraft(data);
      return {
        ok: true,
        mode: 'draft',
        order_id: fallback.order_id,
        message: 'Das Bestellformular wurde gespeichert. Bitte hinterlege in config.js einen API- oder Checkout-Endpoint, um Rechnung, TWINT oder Karte live zu verarbeiten.'
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const contentType = res.headers.get('content-type') || '';
    let payload = {};
    if (contentType.includes('application/json')) {
      payload = await res.json();
    } else {
      const text = await res.text();
      payload = { message: text };
    }

    if (!res.ok) {
      throw new Error(payload.message || 'Der Server hat die Bestellung abgelehnt.');
    }

    return { ok: true, mode: 'api', ...payload };
  }

  function chooseEndpoint(paymentMethod, cfg) {
    if (paymentMethod === 'invoice' && cfg.invoiceApiUrl) return cfg.invoiceApiUrl;
    if ((paymentMethod === 'twint' || paymentMethod === 'card') && cfg.checkoutApiUrl) return cfg.checkoutApiUrl;
    if (paymentMethod === 'twint' && cfg.twintCheckoutUrl) return cfg.twintCheckoutUrl;
    if (paymentMethod === 'card' && cfg.cardCheckoutUrl) return cfg.cardCheckoutUrl;
    if (cfg.orderApiUrl) return cfg.orderApiUrl;
    return '';
  }

  function handleOrderResponse(response, data, cfg) {
    if (response.checkout_url) {
      window.location.href = response.checkout_url;
      return;
    }

    if ((data.payment_method === 'twint' || data.payment_method === 'card') && response.mode === 'draft') {
      showMessage('Das Formular ist bereit, aber für TWINT oder Karte fehlt noch ein Live-Checkout-Endpoint. Hinterlege ihn in config.js oder im Backend.', 'warning');
      return;
    }

    if (response.mode === 'draft') {
      showMessage(response.message, 'warning');
      return;
    }

    showMessage(response.message || 'Die Bestellung wurde erfolgreich übermittelt.', 'success');
  }

  function storeDraft(data) {
    const drafts = JSON.parse(localStorage.getItem('swisstarget_order_drafts') || '[]');
    const order_id = 'SW-' + Date.now();
    drafts.unshift({ order_id, created_at: new Date().toISOString(), ...data });
    localStorage.setItem('swisstarget_order_drafts', JSON.stringify(drafts.slice(0, 20)));
    return { order_id };
  }

  function formToObject(form) {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) continue;
      data[key] = typeof value === 'string' ? value.trim() : value;
    }
    data.accept_trial = form.querySelector('input[name="accept_trial"]').checked;
    data.accept_terms = form.querySelector('input[name="accept_terms"]').checked;
    return data;
  }

  function paymentLabel(value) {
    return ({ invoice: 'Rechnung', twint: 'TWINT', card: 'Karte' })[value] || value;
  }

  function showMessage(message, type) {
    const el = document.getElementById('order-message');
    if (!el) return;
    el.className = `order-message ${type}`;
    el.textContent = message;
  }

  function clearMessage() {
    const el = document.getElementById('order-message');
    if (!el) return;
    el.className = 'order-message';
    el.textContent = '';
  }
})();
