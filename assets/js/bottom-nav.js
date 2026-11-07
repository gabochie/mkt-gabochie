(function () {
  'use strict';
  var WA = 'https://wa.me/233506384917';
  var tabs = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/#system', label: 'How It Works', icon: 'pin' },
    { href: '/free-audit.html', label: 'Free Audit', icon: 'clipboard', cta: true },
    { href: '/#blog', label: 'Blog', icon: 'book' },
    { href: WA, label: 'WhatsApp', icon: 'chat', ext: true }
  ];
  var icons = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="m8.5 13 2.3 2.3L15.5 11"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l2-3A8.5 8.5 0 1 1 21 11.5z"/><path d="M9.5 9.5c0 3 2 5 5 5"/>'
  };
  function svg(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
  }
  var css = '' +
    '#gb-bottom-nav{display:none}' +
    '@media (max-width:767px){' +
      '#gb-bottom-nav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:55;background:rgba(255,255,255,.97);' +
        '-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid #e5e7eb;' +
        'padding:4px 6px calc(4px + env(safe-area-inset-bottom));justify-content:space-around;align-items:flex-end;' +
        'box-shadow:0 -4px 20px rgba(0,0,0,.06);}' +
      '#gb-bottom-nav a{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;' +
        'color:#6b7280;font:600 10.5px/1.2 system-ui,-apple-system,sans-serif;padding:3px 0;-webkit-tap-highlight-color:transparent;}' +
      '#gb-bottom-nav a svg{width:22px;height:22px}' +
      '#gb-bottom-nav a.gb-active{color:#1A7B3A}' +
      '#gb-bottom-nav a .gb-ico{width:46px;height:46px;border-radius:50%;background:#1A7B3A;color:#fff;display:flex;' +
        'align-items:center;justify-content:center;margin-top:-22px;box-shadow:0 6px 16px rgba(26,123,58,.42);border:3px solid #fff;}' +
      '#gb-bottom-nav a .gb-ico svg{width:24px;height:24px}' +
      'body{padding-bottom:calc(70px + env(safe-area-inset-bottom)) !important;}' +
      '.fixed.bottom-6.right-6{display:none !important;}' +
      '#pwa-install{bottom:calc(86px + env(safe-area-inset-bottom)) !important;}' +
    '}' +
    '@media (min-width:768px){#gb-bottom-nav{display:none !important}}';
  function render() {
    if (document.getElementById('gb-bottom-nav')) return;
    var nav = document.createElement('nav');
    nav.id = 'gb-bottom-nav';
    nav.setAttribute('aria-label', 'Primary mobile navigation');
    nav.innerHTML = tabs.map(function (t) {
      var inner = t.cta ? '<span class="gb-ico">' + svg(t.icon, 24) + '</span>' : svg(t.icon, 22);
      var ext = t.ext ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + t.href + '"' + ext + ' data-gb="' + t.href + '">' + inner + '<span>' + t.label + '</span></a>';
    }).join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.appendChild(nav);
    markActive();
    window.addEventListener('hashchange', markActive);
  }
  function markActive() {
    var path = location.pathname.replace(/index\.html$/, '/');
    var hash = location.hash;
    var links = document.querySelectorAll('#gb-bottom-nav a');
    for (var i = 0; i < links.length; i++) {
      var key = links[i].getAttribute('data-gb');
      var active = false;
      if (key === '/') active = (path === '/' && hash !== '#system' && hash !== '#blog' && hash !== '#pricing');
      else if (key.indexOf('/#') === 0) active = (path === '/' && hash === key.slice(1));
      else if (key === '/free-audit.html') active = (path === '/free-audit.html');
      links[i].classList.toggle('gb-active', active);
      if (active) links[i].setAttribute('aria-current', 'page'); else links[i].removeAttribute('aria-current');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
