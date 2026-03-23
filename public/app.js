(function () {
  const config = window.SWISSTARGET_CONFIG || {};
  const appUrl = config.appUrl || "https://app.myswisstarget.ch";
  document.querySelectorAll('.app-link').forEach((link) => {
    link.setAttribute('href', appUrl);
  });
})();
