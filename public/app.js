(function () {
  const STORAGE_KEY = 'swisstarget_site_content';
  const ORDER_KEY = 'swisstarget_customer_orders';
  const config = window.SWISSTARGET_CONFIG || {};
  const appUrl = config.appUrl || 'https://app.myswisstarget.ch';

  const CMS_DEFAULTS = {
    nav: {
      modules: 'Module',
      disciplines: 'Disziplinen',
      why: 'Warum SwissTarget?',
      prices: 'Preise',
      order: 'Bestellen',
      faq: 'FAQ'
    },
    hero: {
      eyebrow: 'Die Plattform für den Schweizer Schiesssport',
      title: 'Die moderne Schweizer Plattform für Schiessverwaltung.',
      lead: 'mySwissTarget.ch verbindet <strong>Anlass</strong>, <strong>Feldschiessen / Obligatorisches Schiessen</strong> und <strong>Verein intern</strong> in einem System – für Vereine, Schiessverwalter, Organisatoren und den digitalen Alltag im Schweizer Schiesssport.',
      primaryLabel: 'Probeabo starten',
      secondaryLabel: 'Module ansehen',
      stats: [
        { title: '1 Login', text: 'für Bestellung, Kundenbereich und App' },
        { title: '3 Module', text: 'Anlass, Feldschiessen / OP, Verein intern' },
        { title: '6 Lizenzen', text: 'G300, G50, G10, P50, P25, P10' },
        { title: 'Schweiz-Fokus', text: 'für Vereine, Schützenhäuser und Organisatoren' }
      ]
    },
    modulesSection: {
      eyebrow: 'Die 3 Module im Zentrum',
      title: 'Genau die drei Bereiche, die eure App im Alltag stark machen',
      lead: 'Keine Einzellösung für nur einen Teilbereich. mySwissTarget.ch bündelt den Schiesssport-Alltag in einer Plattform – von der Anmeldung bis zur Meisterschaft, von Feldschiessen und OP bis zu internen Abrechnungen und Mitgliederverwaltung.'
    },
    modules: [
      {
        label: 'Modul 1',
        title: 'Anlass',
        text: 'Für Schiessanlässe von der Anmeldung bis zur Abrechnung – mit Resultaterfassung, Gruppen, Ranglisten, Berichten und klarer Auswertung in einem Ablauf.',
        bullets: [
          'Teilnehmer, Standblätter und Resultate',
          'Gruppen, Ranglisten, Statistiken und Berichte',
          'Sauberer Ablauf für Vereinsanlässe und Wettkämpfe'
        ],
        image: 'assets/module_anlass_clean.jpg',
        alt: 'Schütze mit Laptop und Resultatübersicht im Schützenhaus'
      },
      {
        label: 'Modul 2',
        title: 'Feldschiessen /<br>Obligatorisches Schiessen',
        text: 'Für den laufenden Betrieb am Schiesstag – direkt, verständlich und auf die Praxis von Feldschiessen und Obligatorischem Schiessen in der Schweiz ausgerichtet.',
        bullets: [
          'Standblatt Feldschiessen und Standblatt OP',
          'Standardgewehr, STGW 90 / 57-03 und Pistole',
          'Auswertungen, Berichte und SAT-nahe Abläufe'
        ],
        image: 'assets/module_feld_clean.jpg',
        alt: 'Pistolenschütze im Schweizer Schiesssport'
      },
      {
        label: 'Modul 3',
        title: 'Verein intern',
        text: 'Alles, was ein Verein intern braucht – Mitglieder, Meisterschaften, Abrechnungen, Munitionsabrechnung, Statistiken und ein sauber geführter digitaler Vereinsalltag.',
        bullets: [
          'Interne Abrechnungen und Munitionsabrechnung',
          'Mitgliederverwaltung und Meisterschaften',
          'Interne Ranglisten und Vereinsübersichten'
        ],
        image: 'assets/module_verein_clean.jpg',
        alt: 'Vereinsmitglieder mit Laptop und Resultatlisten'
      }
    ],
    why: {
      eyebrow: 'Warum SwissTarget?',
      title: 'Nicht nur OP / Feldschiessen. Nicht nur Vereinswettkämpfe.',
      lead: 'Sondern eine durchgehende Plattform für den ganzen Schiesssport-Alltag. mySwissTarget.ch verbindet reale Vereinsprozesse, Resultate, Abrechnungen und Freischaltungen in einem System – modern im Auftritt und klar in der Bedienung.',
      points: [
        { title: 'Eine Plattform', text: 'Anlass, OP / Feldschiessen und Verein intern arbeiten zusammen.' },
        { title: 'Für die Schweiz gebaut', text: 'Begriffe, Disziplinen und Abläufe passen zum Schweizer Schiesssport.' },
        { title: 'Sauber vermarktet', text: 'Verkaufsseite, Bestellung, Probeabo und Kundenbereich greifen logisch ineinander.' }
      ]
    },
    disciplines: {
      eyebrow: 'Disziplinen im System',
      title: 'Für Gewehr, Pistole, Kleinkaliber und Luftdruck',
      lead: 'mySwissTarget.ch deckt die relevanten Disziplin-Lizenzen im Schweizer Schiesssport ab und verbindet sie mit Vereinslogik, Anlassverwaltung und professionellem Abo- / Freischaltprozess.',
      items: [
        { code: 'G300', text: 'Gewehr 300m' },
        { code: 'G50', text: 'Gewehr 50m Kleinkaliber' },
        { code: 'G10', text: 'Gewehr 10m Luftgewehr' },
        { code: 'P50', text: 'Pistole 50m' },
        { code: 'P25', text: 'Pistole 25m' },
        { code: 'P10', text: 'Pistole 10m Luftpistole' },
        { code: 'Standardgewehr', text: 'Vereins- und Anlassbetrieb' },
        { code: 'STGW 90 / 57-03', text: 'Ideal für Feldschiessen und OP' }
      ]
    },
    prices: {
      eyebrow: 'Preise',
      title: 'Klar, fair und vereinsfreundlich',
      lead: 'Ein Grundpaket, ein Pro-Paket und ein kostenloser Testmonat – genau so, dass Vereine schnell starten, fair bezahlen und bei Bedarf direkt erweitert werden können.',
      cards: [
        {
          title: 'SwissTarget Verein',
          value: 'CHF 25',
          note: 'pro Monat',
          features: ['Anlass', 'Feldschiessen / Obligatorisches Schiessen', 'Verein intern', 'Updates und Standard-Support'],
          featured: false,
          cta: ''
        },
        {
          title: 'Pro-Paket',
          value: '+ CHF 10',
          note: 'pro Monat',
          features: ['SAT-Admin', 'SIUS / Schiessanlagen-Schnittstelle', 'Erweiterte Auswertungen', 'Jahresmeisterschaft / Premium-Funktionen'],
          featured: false,
          cta: ''
        },
        {
          title: 'Start',
          value: '1 Monat',
          note: 'kostenlos testen',
          features: ['Zahlung per Rechnung, TWINT oder Karte', 'Vereinsfreundlicher Einstieg', 'Direkte Freischaltung nach Bestellablauf'],
          featured: true,
          cta: 'Jetzt bestellen'
        }
      ]
    },
    orderBlock: {
      eyebrow: 'Bestellen & Abo',
      title: 'Ein sauberer Bestellablauf statt unnötig komplizierter Verwaltung',
      lead: 'Kunden, Abos, Probeabo, Zahlungen und Freischaltungen werden sauber geführt – damit Support, Vereine und Organisatoren sofort sehen, was aktiv ist, was getestet wird und was freigeschaltet werden muss.',
      steps: [
        'Paket wählen und Verein erfassen',
        'Zahlung per Rechnung, TWINT oder Karte',
        'Admin- und Kundenbereich für Status, Zahlungen und Freischaltung'
      ]
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Häufige Fragen zur Plattform',
      items: [
        {
          question: 'Für wen ist mySwissTarget.ch gedacht?',
          answer: 'Für Vereine, Organisatoren, Schiessverwalter und Schützenhäuser, die Anlass, OP / Feldschiessen und Verein intern digital in einer Plattform führen wollen.'
        },
        {
          question: 'Wie funktioniert die Freischaltung?',
          answer: 'Über Probeabo, Zahlung per Rechnung, TWINT oder Karte. Danach bleibt das System aktiv und der Verein kann direkt starten.'
        },
        {
          question: 'Welche Disziplinen deckt das System ab?',
          answer: 'Standardgewehr, STGW 90 / 57-03, Pistole, Kleinkaliber, Luftgewehr, Luftpistole und weitere Bereiche im Vereinsalltag.'
        },
        {
          question: 'Gibt es einen Admin- und Kundenbereich?',
          answer: 'Ja. Für Kunden, Abos, Zahlungen, Freischaltungen und Support. In dieser Website-Version ist das als klickbare Demo vorbereitet.'
        }
      ]
    },
    footer: {
      tagline: 'mySwissTarget.ch – die Schweizer Plattform für Anlass, Feldschiessen / Obligatorisches Schiessen und Verein intern.',
      email: config.supportEmail || 'info@myswisstarget.ch'
    },
    contact: {
      eyebrow: 'Kontakt & Demo',
      title: 'Bereit für einen sauberen Start mit SwissTarget?',
      lead: 'Lass dir die Plattform zeigen, starte das Probeabo oder nimm direkt Kontakt auf. So wird aus der Verkaufsseite ein echter Einstieg für Vereine, Organisatoren und Schützenhäuser.',
      primaryLabel: 'Probeabo starten',
      secondaryLabel: 'Kontakt aufnehmen',
      boxes: [
        { title: 'Schnelle Demo', text: 'Zeige Anlass, Feldschiessen / OP und Verein intern direkt im echten Ablauf.' },
        { title: 'Vereinsfreundliche Einführung', text: 'Probeabo, Rechnung, TWINT oder Karte – so wie Vereine es im Alltag brauchen.' },
        { title: 'Saubere Freischaltung', text: 'Kundenbereich, Adminbereich und Bestelllogik greifen logisch ineinander.' }
      ]
    },
    media: {
      hero: 'assets/hero_clean.jpg',
      why: 'assets/section_platform_clean.jpg',
      order: 'assets/module_anlass_clean.jpg'
    }
  };

  document.querySelectorAll('.app-link').forEach((link) => link.setAttribute('href', appUrl));

  const page = document.body.dataset.page || 'generic';
  const cms = loadCmsConfig();
  applyCms(cms);

  initChoiceCards();
  initOrderForm(config);
  initCustomerArea();
  initAdminCms(cms);

  function loadCmsConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return mergeDeep(clone(CMS_DEFAULTS), saved || {});
    } catch (error) {
      return clone(CMS_DEFAULTS);
    }
  }

  function saveCmsConfig(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function applyCms(cmsData) {
    setText('nav-modules', cmsData.nav.modules);
    setText('nav-disciplines', cmsData.nav.disciplines);
    setText('nav-why', cmsData.nav.why);
    setText('nav-prices', cmsData.nav.prices);
    setText('nav-order', cmsData.nav.order);
    setText('nav-faq', cmsData.nav.faq);

    setText('hero-eyebrow', cmsData.hero.eyebrow);
    setHtml('hero-title', cmsData.hero.title);
    setHtml('hero-lead', cmsData.hero.lead);
    setText('hero-primary', cmsData.hero.primaryLabel);
    setText('hero-secondary', cmsData.hero.secondaryLabel);
    setBackgroundImage('hero-media', cmsData.media.hero);
    renderHeroStats(cmsData.hero.stats || []);

    setText('modules-eyebrow', cmsData.modulesSection.eyebrow || 'Die 3 Module im Zentrum');
    setText('modules-title', cmsData.modulesSection.title);
    setText('modules-lead', cmsData.modulesSection.lead);
    renderModules(cmsData.modules || []);

    setText('why-eyebrow', cmsData.why.eyebrow);
    setHtml('why-title', cmsData.why.title);
    setText('why-lead', cmsData.why.lead);
    setImage('why-image', cmsData.media.why);
    renderComparePoints(cmsData.why.points || []);

    setText('disciplines-eyebrow', cmsData.disciplines.eyebrow);
    setText('disciplines-title', cmsData.disciplines.title);
    setText('disciplines-lead', cmsData.disciplines.lead);
    renderDisciplines(cmsData.disciplines.items || []);

    setText('prices-eyebrow', cmsData.prices.eyebrow);
    setText('prices-title', cmsData.prices.title);
    setText('prices-lead', cmsData.prices.lead);
    renderPrices(cmsData.prices.cards || []);

    setText('order-eyebrow', cmsData.orderBlock.eyebrow);
    setHtml('order-title', cmsData.orderBlock.title);
    setText('order-lead', cmsData.orderBlock.lead);
    renderOrderSteps(cmsData.orderBlock.steps || []);
    setImage('order-image', cmsData.media.order);

    setText('faq-eyebrow', cmsData.faq.eyebrow || 'FAQ');
    setText('faq-title', cmsData.faq.title);
    renderFaq(cmsData.faq.items || []);

    setText('footer-tagline', cmsData.footer.tagline);
    setText('footer-mail', cmsData.footer.email);
    const mail = document.getElementById('footer-mail');
    if (mail) mail.href = `mailto:${cmsData.footer.email}`;

    setText('order-page-eyebrow', cmsData.orderBlock.eyebrow);
    setHtml('order-page-title', 'SwissTarget jetzt bestellen und 1 Monat kostenlos testen.');
    setHtml('order-page-lead', 'Wähle dein Paket, erfasse die Vereinsdaten und entscheide, ob du per <strong>Rechnung</strong>, <strong>TWINT</strong> oder <strong>Karte</strong> bezahlen willst. Nach der Bestellung kann der Verein direkt freigeschaltet werden – für Anlass, Feldschiessen / OP und Verein intern in einem System.');
  }

  function renderHeroStats(items) {
    const root = document.getElementById('hero-stats');
    if (!root) return;
    root.innerHTML = items.map((item) => `
      <div class="hero-stat">
        <strong>${escapeHtml(item.title || '')}</strong>
        <span>${escapeHtml(item.text || '')}</span>
      </div>`).join('');
  }

  function renderModules(items) {
    const root = document.getElementById('module-grid');
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <article class="module-card showcase-card">
        <div class="card-body">
          <div class="module-label">${escapeHtml(item.label || `Modul ${index + 1}`)}</div>
          <h3>${item.title || ''}</h3>
          <p>${escapeHtml(item.text || '')}</p>
          <div class="check-list compact-list">
            ${(item.bullets || []).map((bullet) => `<div class="check-item"><span class="check-icon">✓</span><span>${escapeHtml(bullet)}</span></div>`).join('')}
          </div>
        </div>
        <img class="card-image showcase-image" src="${escapeAttribute(item.image || '')}" alt="${escapeAttribute(item.alt || item.text || '')}">
      </article>
    `).join('');
  }

  function renderComparePoints(items) {
    const root = document.getElementById('compare-grid');
    if (!root) return;
    root.innerHTML = items.map((item) => `
      <div class="compare-point">
        <strong>${escapeHtml(item.title || '')}</strong>
        <span>${escapeHtml(item.text || '')}</span>
      </div>
    `).join('');
  }

  function renderDisciplines(items) {
    const root = document.getElementById('discipline-grid');
    if (!root) return;
    root.innerHTML = items.map((item) => `
      <div class="discipline-card">
        <strong>${escapeHtml(item.code || '')}</strong>
        <span>${escapeHtml(item.text || '')}</span>
      </div>
    `).join('');
  }

  function renderPrices(items) {
    const root = document.getElementById('pricing-grid');
    if (!root) return;
    root.innerHTML = items.map((item) => `
      <article class="price-card ${item.featured ? 'featured-price' : ''}">
        <h3>${escapeHtml(item.title || '')}</h3>
        <div class="price-value">${escapeHtml(item.value || '')}</div>
        <div class="price-note">${escapeHtml(item.note || '')}</div>
        <ul>
          ${(item.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
        </ul>
        ${item.cta ? `<div class="hero-actions compact-actions"><a class="btn btn-block" href="bestellung.html">${escapeHtml(item.cta)}</a></div>` : ''}
      </article>
    `).join('');
  }

  function renderOrderSteps(steps) {
    const root = document.getElementById('order-steps');
    if (!root) return;
    root.innerHTML = steps.map((step, index) => `
      <div class="step-card">
        <strong>Schritt ${index + 1}</strong>
        <span>${escapeHtml(step)}</span>
      </div>
    `).join('');
  }

  function renderFaq(items) {
    const root = document.getElementById('faq-grid');
    if (!root) return;
    root.innerHTML = items.map((item) => `
      <article class="faq-card">
        <h3>${escapeHtml(item.question || '')}</h3>
        <p>${escapeHtml(item.answer || '')}</p>
      </article>
    `).join('');
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node && typeof value === 'string') node.textContent = value;
  }

  function setHtml(id, value) {
    const node = document.getElementById(id);
    if (node && typeof value === 'string') node.innerHTML = value;
  }

  function setImage(id, src) {
    const node = document.getElementById(id);
    if (node && src) node.src = src;
  }

  function setBackgroundImage(id, src) {
    const node = document.getElementById(id);
    if (node && src) node.style.backgroundImage = `url('${src.replace(/'/g, "\\'")}')`;
  }

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
    const planMap = { basis: { label: 'SwissTarget Verein', price: 'CHF 25' }, basis_pro: { label: 'SwissTarget Verein + Pro', price: 'CHF 35' } };
    const paymentMap = { invoice: 'Rechnung', twint: 'TWINT', card: 'Karte' };
    setText('summary-plan', planMap[plan].label);
    setText('summary-price', planMap[plan].price);
    setText('summary-total', planMap[plan].price);
    setText('summary-payment', paymentMap[payment]);
  }

  function initOrderForm(cfg) {
    const form = document.getElementById('order-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('package')) {
      const wanted = params.get('package') === 'pro' ? 'basis_pro' : 'basis';
      const radio = document.querySelector(`input[name="plan"][value="${wanted}"]`);
      if (radio) radio.checked = true;
    }
    updateSummary();

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
  }

  async function submitOrder(data, cfg) {
    const endpoint = chooseEndpoint(data.payment_method, cfg);
    if (!endpoint) {
      const fallback = storeOrder(data, { source: 'draft' });
      return {
        ok: true,
        mode: 'draft',
        order_id: fallback.order_id,
        message: 'Bestellung gespeichert. Für den Live-Betrieb kannst du in config.js API- oder Checkout-Endpoints hinterlegen.'
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    const contentType = res.headers.get('content-type') || '';
    let payload = {};
    if (contentType.includes('application/json')) payload = await res.json();
    else payload = { message: await res.text() };
    if (!res.ok) throw new Error(payload.message || 'Der Server hat die Bestellung abgelehnt.');
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

  function handleOrderResponse(response, data) {
    if (response.checkout_url) {
      storeOrder(data, { source: 'checkout', checkout_url: response.checkout_url });
      window.location.href = response.checkout_url;
      return;
    }

    const stored = storeOrder(data, { source: response.mode || 'api', order_id: response.order_id, message: response.message });
    if (response.mode === 'draft') {
      showMessage(response.message || `Bestellung ${stored.order_id} gespeichert.`, 'warning');
      return;
    }
    showMessage(response.message || 'Die Bestellung wurde erfolgreich übermittelt.', 'success');
  }

  function storeOrder(data, meta = {}) {
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
    const orderId = meta.order_id || `SW-${Date.now()}`;
    const record = {
      order_id: orderId,
      created_at: new Date().toISOString(),
      club_name: data.club_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone,
      plan: data.plan,
      plan_label: data.plan_label,
      monthly_price_chf: data.monthly_price_chf,
      payment_method: data.payment_method,
      payment_label: data.payment_label,
      status: data.payment_method === 'invoice' ? 'trialing' : 'pending_payment',
      payment_status: data.payment_method === 'invoice' ? 'open' : 'checkout',
      notes: data.notes || '',
      source: meta.source || 'draft'
    };
    orders.unshift(record);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders.slice(0, 30)));
    localStorage.setItem('swisstarget_order_drafts', JSON.stringify(orders.slice(0, 30)));
    return record;
  }

  function initCustomerArea() {
    if (page !== 'customer') return;
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
    const root = document.getElementById('customer-orders');
    if (!root) return;

    const trialCount = orders.filter((item) => item.status === 'trialing').length;
    const activeCount = orders.filter((item) => ['trialing', 'active', 'pending_payment'].includes(item.status)).length;
    const openCount = orders.filter((item) => item.payment_status === 'open' || item.payment_status === 'checkout').length;
    setText('customer-trial-count', String(trialCount));
    setText('customer-active-count', String(activeCount));
    setText('customer-open-count', String(openCount));

    if (!orders.length) {
      root.innerHTML = '<article class="customer-order-card"><h3>Noch keine Bestellung gespeichert</h3><p class="lead">Starte über das Bestellformular eine Demo-Bestellung. Sie erscheint danach automatisch in diesem Kundenbereich.</p></article>';
    } else {
      root.innerHTML = orders.map((item) => `
        <article class="customer-order-card">
          <div class="panel-title-row">
            <h3>${escapeHtml(item.club_name || 'Unbenannter Verein')}</h3>
            <span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          <p><strong>${escapeHtml(item.plan_label || '')}</strong> · ${escapeHtml(item.payment_label || '')}</p>
          <div class="customer-order-meta">
            <span>Bestellung: ${escapeHtml(item.order_id)}</span>
            <span>Kontakt: ${escapeHtml(item.contact_name || '')}</span>
            <span>E-Mail: ${escapeHtml(item.email || '')}</span>
            <span>Zahlung: ${escapeHtml(item.payment_status || '')}</span>
          </div>
        </article>
      `).join('');
    }

    document.getElementById('clear-customer-data')?.addEventListener('click', () => {
      localStorage.removeItem(ORDER_KEY);
      localStorage.removeItem('swisstarget_order_drafts');
      window.location.reload();
    });
  }

  function initAdminCms(cms) {
    if (page !== 'admin') return;

    const form = document.getElementById('cms-form');
    if (!form) return;
    renderAdminRepeaters(cms);
    populateForm(form, cms);

    document.querySelectorAll('.cms-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cms-nav-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.cms-panel').forEach((panel) => panel.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.cms-panel[data-panel="${btn.dataset.tab}"]`)?.classList.add('active');
      });
    });

    document.getElementById('cms-save')?.addEventListener('click', () => {
      const next = collectFormData(form);
      saveCmsConfig(next);
      alert('Änderungen gespeichert. Öffne die Startseite in einem neuen Tab oder lade sie neu.');
    });

    document.getElementById('cms-reset')?.addEventListener('click', () => {
      if (!window.confirm('Website-Inhalte auf Standard zurücksetzen?')) return;
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    });

    document.getElementById('cms-export')?.addEventListener('click', () => {
      const next = collectFormData(form);
      const blob = new Blob([JSON.stringify(next, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'myswisstarget-cms-export.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('cms-import')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        saveCmsConfig(mergeDeep(clone(CMS_DEFAULTS), data));
        window.location.reload();
      } catch (error) {
        alert('Die JSON-Datei konnte nicht importiert werden.');
      }
    });
  }

  function renderAdminRepeaters(cms) {
    renderModuleRepeater(cms.modules || []);
    renderCompareRepeater(cms.why.points || []);
    renderPriceRepeater(cms.prices.cards || []);
    renderFaqRepeater(cms.faq.items || []);
  }

  function renderModuleRepeater(items) {
    const root = document.getElementById('cms-modules-repeater');
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <div class="cms-repeater-item">
        <h3>Modul ${index + 1}</h3>
        <label><span>Label</span><input name="modules.${index}.label" type="text" value="${escapeAttribute(item.label || '')}"></label>
        <label><span>Titel</span><input name="modules.${index}.title" type="text" value="${escapeAttribute(stripBr(item.title || ''))}"></label>
        <label><span>Text</span><textarea name="modules.${index}.text" rows="3">${escapeTextarea(item.text || '')}</textarea></label>
        <label><span>Bildpfad</span><input name="modules.${index}.image" type="text" value="${escapeAttribute(item.image || '')}"></label>
        <label><span>Bulletpoints (eine Zeile pro Punkt)</span><textarea name="modules.${index}.bullets" rows="4">${escapeTextarea((item.bullets || []).join('\n'))}</textarea></label>
      </div>
    `).join('');
  }

  function renderCompareRepeater(items) {
    const root = document.getElementById('cms-compare-repeater');
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <div class="cms-repeater-item">
        <h3>Vergleichspunkt ${index + 1}</h3>
        <label><span>Titel</span><input name="why.points.${index}.title" type="text" value="${escapeAttribute(item.title || '')}"></label>
        <label><span>Text</span><textarea name="why.points.${index}.text" rows="3">${escapeTextarea(item.text || '')}</textarea></label>
      </div>
    `).join('');
  }

  function renderPriceRepeater(items) {
    const root = document.getElementById('cms-prices-repeater');
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <div class="cms-repeater-item">
        <h3>Preisbox ${index + 1}</h3>
        <label><span>Titel</span><input name="prices.cards.${index}.title" type="text" value="${escapeAttribute(item.title || '')}"></label>
        <label><span>Wert</span><input name="prices.cards.${index}.value" type="text" value="${escapeAttribute(item.value || '')}"></label>
        <label><span>Hinweis</span><input name="prices.cards.${index}.note" type="text" value="${escapeAttribute(item.note || '')}"></label>
        <label><span>Features (eine Zeile pro Punkt)</span><textarea name="prices.cards.${index}.features" rows="4">${escapeTextarea((item.features || []).join('\n'))}</textarea></label>
        <label><span>CTA Text</span><input name="prices.cards.${index}.cta" type="text" value="${escapeAttribute(item.cta || '')}"></label>
      </div>
    `).join('');
  }

  function renderFaqRepeater(items) {
    const root = document.getElementById('cms-faq-repeater');
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <div class="cms-repeater-item">
        <h3>FAQ ${index + 1}</h3>
        <label><span>Frage</span><input name="faq.items.${index}.question" type="text" value="${escapeAttribute(item.question || '')}"></label>
        <label><span>Antwort</span><textarea name="faq.items.${index}.answer" rows="3">${escapeTextarea(item.answer || '')}</textarea></label>
      </div>
    `).join('');
  }

  function populateForm(form, cms) {
    form.querySelectorAll('input[name], textarea[name]').forEach((field) => {
      const value = readCmsField(cms, field.name);
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) field.value = value.join('\n');
      else field.value = String(value).replace(/<br\s*\/?/gi, '\n').replace(/>/g, '');
    });
  }

  function readCmsField(obj, path) {
    if (path === 'disciplines.items') return (obj.disciplines.items || []).map((item) => `${item.code} | ${item.text}`);
    if (path === 'orderBlock.steps') return obj.orderBlock.steps || [];
    const cleanPath = path.replace(/\.points\./g, '.points.').replace(/\.cards\./g, '.cards.');
    return cleanPath.split('.').reduce((acc, part) => (acc && part in acc ? acc[part] : undefined), obj);
  }

  function collectFormData(form) {
    const next = clone(CMS_DEFAULTS);
    setByPath(next, 'nav.modules', valueOf(form, 'nav.modules'));
    setByPath(next, 'nav.disciplines', valueOf(form, 'nav.disciplines'));
    setByPath(next, 'nav.why', valueOf(form, 'nav.why'));
    setByPath(next, 'nav.prices', valueOf(form, 'nav.prices'));
    setByPath(next, 'nav.order', valueOf(form, 'nav.order'));
    setByPath(next, 'nav.faq', valueOf(form, 'nav.faq'));
    setByPath(next, 'hero.eyebrow', valueOf(form, 'hero.eyebrow'));
    setByPath(next, 'hero.title', valueOf(form, 'hero.title'));
    setByPath(next, 'hero.lead', valueOf(form, 'hero.lead'));
    setByPath(next, 'hero.primaryLabel', valueOf(form, 'hero.primaryLabel'));
    setByPath(next, 'hero.secondaryLabel', valueOf(form, 'hero.secondaryLabel'));
    setByPath(next, 'media.hero', valueOf(form, 'media.hero'));
    setByPath(next, 'modulesSection.title', valueOf(form, 'modulesSection.title'));
    setByPath(next, 'modulesSection.lead', valueOf(form, 'modulesSection.lead'));
    setByPath(next, 'why.eyebrow', valueOf(form, 'why.eyebrow'));
    setByPath(next, 'why.title', valueOf(form, 'why.title'));
    setByPath(next, 'why.lead', valueOf(form, 'why.lead'));
    setByPath(next, 'media.why', valueOf(form, 'media.why'));
    setByPath(next, 'disciplines.title', valueOf(form, 'disciplines.title'));
    setByPath(next, 'disciplines.lead', valueOf(form, 'disciplines.lead'));
    setByPath(next, 'prices.title', valueOf(form, 'prices.title'));
    setByPath(next, 'prices.lead', valueOf(form, 'prices.lead'));
    setByPath(next, 'orderBlock.title', valueOf(form, 'orderBlock.title'));
    setByPath(next, 'orderBlock.lead', valueOf(form, 'orderBlock.lead'));
    setByPath(next, 'faq.title', valueOf(form, 'faq.title'));
    setByPath(next, 'footer.tagline', valueOf(form, 'footer.tagline'));
    setByPath(next, 'footer.email', valueOf(form, 'footer.email'));
    setByPath(next, 'contact.eyebrow', valueOf(form, 'contact.eyebrow'));
    setByPath(next, 'contact.title', valueOf(form, 'contact.title'));
    setByPath(next, 'contact.lead', valueOf(form, 'contact.lead'));
    setByPath(next, 'contact.primaryLabel', valueOf(form, 'contact.primaryLabel'));
    setByPath(next, 'contact.secondaryLabel', valueOf(form, 'contact.secondaryLabel'));
    next.contact.boxes = next.contact.boxes.map((item, index) => ({
      title: valueOf(form, `contact.boxes.${index}.title`) || item.title,
      text: valueOf(form, `contact.boxes.${index}.text`) || item.text
    }));

    next.modules = next.modules.map((item, index) => ({
      ...item,
      label: valueOf(form, `modules.${index}.label`) || item.label,
      title: valueOf(form, `modules.${index}.title`) || stripBr(item.title),
      text: valueOf(form, `modules.${index}.text`) || item.text,
      image: valueOf(form, `modules.${index}.image`) || item.image,
      bullets: linesOf(form, `modules.${index}.bullets`) || item.bullets
    }));
    next.modules.forEach((item, index) => {
      if (index === 1 && !item.title.includes('<br>')) item.title = item.title.replace(' / ', ' /<br>');
    });

    next.why.points = next.why.points.map((item, index) => ({
      title: valueOf(form, `why.points.${index}.title`) || item.title,
      text: valueOf(form, `why.points.${index}.text`) || item.text
    }));

    next.disciplines.items = linesOf(form, 'disciplines.items').map((line) => {
      const [code, text] = line.split('|').map((part) => (part || '').trim());
      return { code: code || '', text: text || '' };
    }).filter((item) => item.code);

    next.prices.cards = next.prices.cards.map((item, index) => ({
      ...item,
      title: valueOf(form, `prices.cards.${index}.title`) || item.title,
      value: valueOf(form, `prices.cards.${index}.value`) || item.value,
      note: valueOf(form, `prices.cards.${index}.note`) || item.note,
      features: linesOf(form, `prices.cards.${index}.features`) || item.features,
      cta: valueOf(form, `prices.cards.${index}.cta`) || item.cta
    }));

    next.orderBlock.steps = linesOf(form, 'orderBlock.steps');
    next.faq.items = next.faq.items.map((item, index) => ({
      question: valueOf(form, `faq.items.${index}.question`) || item.question,
      answer: valueOf(form, `faq.items.${index}.answer`) || item.answer
    }));

    return next;
  }

  function valueOf(form, name) {
    return form.querySelector(`[name="${CSS.escape(name)}"]`)?.value.trim() || '';
  }

  function linesOf(form, name) {
    const raw = valueOf(form, name);
    return raw ? raw.split('\n').map((line) => line.trim()).filter(Boolean) : [];
  }

  function setByPath(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) current[part] = value;
      else current = current[part];
    });
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

  function statusClass(status) {
    if (status === 'active') return 'active';
    if (status === 'trialing') return 'trial';
    if (status === 'cancelled') return 'cancelled';
    if (status === 'past_due' || status === 'suspended') return 'paused';
    return 'pending';
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDeep(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      if (Array.isArray(sourceValue)) target[key] = sourceValue;
      else if (sourceValue && typeof sourceValue === 'object') {
        target[key] = mergeDeep(target[key] && typeof target[key] === 'object' ? target[key] : {}, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    }
    return target;
  }

  function stripBr(value) {
    return String(value || '').replace(/<br\s*\/?>/gi, ' ');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function escapeTextarea(value) {
    return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
