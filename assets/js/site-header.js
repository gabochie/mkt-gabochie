(function () {
  var path = window.location.pathname;
  if (/(^|\/)(free-audit|saas-vote)\.html$/.test(path)) return;

  var LOGO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

  var CSS = [
    '.gb-global-nav{background:#fff!important;border-bottom:1px solid #e5e7eb!important;color:#111827!important;font-family:Inter,system-ui,-apple-system,sans-serif}',
    '.gb-global-nav .gb-h-wrap{max-width:1200px;margin:0 auto;padding:0 16px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}',
    '.gb-global-nav .gb-h-brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:#0F5C28;font-weight:800;font-size:17px;letter-spacing:-.3px;white-space:nowrap}',
    '.gb-global-nav .gb-h-brand svg{width:28px;height:28px;color:#1A7B3A;flex:0 0 auto}',
    '.gb-global-nav .gb-h-links{display:flex;align-items:center;gap:22px}',
    '.gb-global-nav .gb-h-links a{font-size:13.5px;font-weight:600;color:#4b5563;text-decoration:none;transition:color .15s}',
    '.gb-global-nav .gb-h-links a:hover{color:#1A7B3A}',
    '.gb-global-nav .gb-h-accent{color:#1A7B3A!important;font-weight:700!important}',
    '.gb-global-nav .gb-h-cta{background:#1A7B3A!important;color:#fff!important;padding:9px 16px!important;border-radius:999px!important;font-weight:700!important;font-size:13px!important;white-space:nowrap;box-shadow:0 1px 2px rgba(15,92,40,.2)}',
    '.gb-global-nav .gb-h-cta:hover{background:#0F5C28!important}',
    '.gb-global-nav .gb-h-burger{display:none;align-items:center;justify-content:center;background:none;border:0;padding:0;margin-right:-10px;cursor:pointer;color:#374151;width:44px;height:44px;min-width:44px;min-height:44px}',
    '.gb-global-nav .gb-h-burger svg{width:24px;height:24px}',
    '.gb-global-nav .gb-h-menu{display:none;background:#fff;border-top:1px solid #f3f4f6;padding:8px 16px 18px}',
    '.gb-global-nav .gb-h-menu a{display:block;padding:12px 2px;font-size:15px;font-weight:600;color:#374151;text-decoration:none;border-bottom:1px solid #f9fafb}',
    '.gb-global-nav .gb-h-menu a:hover{color:#1A7B3A}',
    '.gb-global-nav .gb-h-menu .gb-h-cta{display:block;text-align:center;margin-top:12px;border:0;padding:13px 16px!important}',
    '.gb-global-nav .gb-h-menu .gb-h-portal{color:#6b7280;font-weight:500;font-size:14px;border:0;padding-top:14px}',
    '@media(max-width:899px){.gb-global-nav .gb-h-links{display:none}.gb-global-nav .gb-h-burger{display:block}.gb-global-nav.gb-h-open .gb-h-menu{display:block}}'
  ].join('');

  var LINKS = [
    ['How It Works', '/#system', ''],
    ['Results', '/#proof', ''],
    ['Pricing', '/#pricing', ''],
    ['Blog', '/#blog', ''],
    ['Systems Audit', '/business-systems-audit/', 'gb-h-accent']
  ];

  function linkMarkup(cls, extra) {
    return LINKS.map(function (l) {
      var c = [l[2], cls, extra || ''].filter(Boolean).join(' ');
      return '<a href="' + l[1] + '"' + (c ? ' class="' + c + '"' : '') + '>' + l[0] + '</a>';
    }).join('');
  }

  function boot() {
    var nav = document.querySelector('nav.fixed') || document.querySelector('nav');
    if (!nav || nav.classList.contains('gb-global-nav')) return;
    if (!nav.querySelector('a')) return;

    if (!document.getElementById('gb-header-style')) {
      var st = document.createElement('style');
      st.id = 'gb-header-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    nav.classList.add('gb-global-nav');
    nav.innerHTML =
      '<div class="gb-h-wrap">' +
        '<a class="gb-h-brand" href="/" aria-label="Gabochie Marketing home">' + LOGO + '<span>Gabochie Marketing</span></a>' +
        '<div class="gb-h-links">' + linkMarkup('') +
          '<a class="gb-h-cta" href="/free-audit.html">Free Audit</a>' +
        '</div>' +
        '<button class="gb-h-burger" type="button" aria-label="Open menu" aria-expanded="false">' +
          '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="gb-h-menu" id="gb-header-menu">' +
        linkMarkup('', '') +
        '<a class="gb-h-cta" href="/free-audit.html">Get Free Audit</a>' +
        '<a class="gb-h-portal" href="/client/login.html">Client Portal</a>' +
      '</div>';

    if (/^\/business-systems-audit\//.test(path)) {
      var accent = nav.querySelector('.gb-h-links .gb-h-accent');
      if (accent) accent.style.textDecoration = 'underline';
    }

    var burger = nav.querySelector('.gb-h-burger');
    function close() {
      nav.classList.remove('gb-h-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
    function toggle(e) {
      if (e) e.stopPropagation();
      var open = nav.classList.toggle('gb-h-open');
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (burger) burger.addEventListener('click', toggle);
    var menu = nav.querySelector('.gb-h-menu');
    if (menu) menu.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('a')) close();
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
