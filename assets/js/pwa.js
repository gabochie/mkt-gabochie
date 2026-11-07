(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
  var deferred = null;
  function removeButton() {
    var b = document.getElementById('pwa-install');
    if (b) b.remove();
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (document.getElementById('pwa-install')) return;
    var b = document.createElement('button');
    b.id = 'pwa-install';
    b.type = 'button';
    b.textContent = 'Install app';
    b.setAttribute('aria-label', 'Install Gabochie app');
    b.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:60;background:#1A7B3A;color:#fff;border:0;border-radius:9999px;padding:10px 16px;font:600 14px system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;';
    b.addEventListener('click', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; removeButton(); });
    });
    document.body.appendChild(b);
  });
  window.addEventListener('appinstalled', removeButton);
})();
