(function () {
  'use strict';
  var WA = 'https://wa.me/233506384917';
  var tabs = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/free-audit.html', label: 'Free Audit', icon: 'clipboard' },
    { href: '/client/login.html', label: 'Portal', icon: 'user', portal: true },
    { href: WA, label: 'WhatsApp', icon: 'chat', ext: true }
  ];
  var icons = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="m8.5 13 2.3 2.3L15.5 11"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l2-3A8.5 8.5 0 1 1 21 11.5z"/><path d="M9.5 9.5c0 3 2 5 5 5"/>'
  };
  function svg(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
  }
  var css = '' +
    '#gb-client-bar{display:none}' +
    '@media (max-width:767px){' +
      '#gb-client-bar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:55;background:rgba(255,255,255,.97);' +
        '-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid #e5e7eb;' +
        'padding:4px 6px calc(4px + env(safe-area-inset-bottom));justify-content:space-around;align-items:flex-end;' +
        'box-shadow:0 -4px 20px rgba(0,0,0,.06);}' +
      '#gb-client-bar a{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;' +
        'color:#6b7280;font:600 10.5px/1.2 system-ui,-apple-system,sans-serif;padding:5px 0;-webkit-tap-highlight-color:transparent;' +
        'transition:transform .12s ease,color .15s ease;}' +
      '#gb-client-bar a:active{transform:scale(.9);}' +
      '#gb-client-bar a svg{width:22px;height:22px}' +
      '#gb-client-bar a.gb-active{color:#1A7B3A}' +
      'body{padding-bottom:calc(64px + env(safe-area-inset-bottom)) !important;}' +
      '#pwa-install{left:12px !important;bottom:calc(78px + env(safe-area-inset-bottom)) !important;}' +
    '}' +
    '@media (min-width:768px){#gb-client-bar{display:none !important}}';
  function render() {
    if (document.getElementById('gb-client-bar')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    var nav = document.createElement('nav');
    nav.id = 'gb-client-bar';
    nav.setAttribute('aria-label', 'Portal quick links');
    nav.innerHTML = tabs.map(function (t) {
      var ext = t.ext ? ' target="_blank" rel="noopener"' : '';
      var active = t.portal ? ' class="gb-active" aria-current="page"' : '';
      return '<a href="' + t.href + '"' + ext + active + '>' + svg(t.icon, 22) + '<span>' + t.label + '</span></a>';
    }).join('');
    document.body.appendChild(nav);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
