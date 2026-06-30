(function initStacklyPreloader() {
  const preloaderEl = document.getElementById('stackly-preloader');
  if (!preloaderEl) return;

  document.documentElement.classList.add('preloader-active');

  const MAX_MS = 2000;
  const MIN_MS = 900;
  const start = performance.now();
  let hidden = false;

  function hidePreloader() {
    if (hidden) return;
    hidden = true;
    const el = document.getElementById('stackly-preloader');
    document.documentElement.classList.remove('preloader-active');
    if (!el) return;
    el.classList.add('is-hidden');
    setTimeout(function () {
      el.remove();
    }, 600);
  }

  function scheduleHide() {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_MS - elapsed);
    setTimeout(hidePreloader, wait);
  }

  window.addEventListener('load', scheduleHide);
  setTimeout(hidePreloader, MAX_MS);

  document.addEventListener('DOMContentLoaded', function () {
    if (document.readyState === 'complete') scheduleHide();
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  if (typeof AOS !== 'undefined' && !window.__stacklyAosInit) {
    window.__stacklyAosInit = true;
    AOS.init({
      duration: 700,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
  }

  
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('navbar--hero');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('navbar--hero');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileOverlay.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileOverlay.classList.add('is-open');
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
    });
  }

  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeSearch();
    }
  });

  
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      closeMobileMenu();
    }
  });
  
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggle  = document.getElementById('searchToggle');
  const searchClose   = document.getElementById('searchClose');
  const searchInput   = document.getElementById('searchInput');

  if (searchToggle && searchOverlay && searchClose && searchInput) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 300);
    });
    searchClose.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) closeSearch();
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        closeSearch();
        window.location.href = 'store.html';
      }
    });
  }
});



function closeMobileMenu() {
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger');
  if (!overlay || !hamburger) return;
  overlay.classList.remove('is-open');
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

function closeSearch() {
  const searchOverlay = document.getElementById('searchOverlay');
  if (!searchOverlay) return;
  searchOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

function showToast(msg, icon = 'fa-circle-check') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i>${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(16px)'; toast.style.transition = 'all 0.35s'; setTimeout(() => toast.remove(), 400); }, 3500);
}

function handleNewsletter(e) {
  e.preventDefault();
  window.location.href = '404.html';
}









window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('userName')) return;
  const session = localStorage.getItem('stackly_user') || sessionStorage.getItem('stackly_user');
  if (!session) { window.location.href = 'signin.html'; return; }
  const user = JSON.parse(session);
  if (user.role === 'admin') { window.location.href = 'admin-dashboard.html'; return; }

  document.getElementById('userName').textContent    = user.name  || 'Guest User';
  document.getElementById('userEmail').textContent   = user.email || 'guest@example.com';
  document.getElementById('profileName').textContent = user.name  || 'Guest User';
  document.getElementById('profileEmail').textContent= user.email || 'guest@example.com';
  document.getElementById('welcomeText').textContent = `Welcome Back, ${user.name || 'Friend'}! 👋`;
  document.getElementById('headerBreadcrumb').textContent = 'Home / Dashboard';

  const initial = (user.name || 'G').charAt(0).toUpperCase();
  document.getElementById('profileAvatar').textContent = initial;

  
  setTimeout(() => {
    const bar = document.getElementById('rewardProgressBar');
    if (bar) bar.style.width = '65%';
  }, 400);
});


const ALL_SECTIONS = [
  'ordersSection','reservationsSection','favoritesSection',
  'rewardsSection','offersSection','couponsSection',
  'notificationsSection','settingsSection'
];
const SECTION_NAMES = {
  ordersSection: 'My Orders',
  reservationsSection: 'Support Tickets',
  favoritesSection: 'Saved Products',
  rewardsSection: 'Reward Credits',
  offersSection: 'Offers & Plans',
  couponsSection: 'My Coupons',
  notificationsSection: 'Notifications',
  settingsSection: 'Settings'
};

function showSection(sectionId, event) {
  if (event) event.preventDefault();

  if (document.getElementById('dashboardHome')) {
    if (typeof window.showCustomerSection === 'function') {
      return window.showCustomerSection(sectionId, event);
    }
    const CUSTOMER_VIEW_MAP = {
      dashboardHome: 'home',
      ordersSection: 'orders',
      reservationsSection: 'reservations',
      favoritesSection: 'favorites',
      rewardsSection: 'rewards',
      offersSection: 'offers',
      energySection: 'energy',
      notificationsSection: 'notifications',
      settingsSection: 'settings'
    };
    const home = document.getElementById('dashboardHome');
    home.setAttribute('data-view', CUSTOMER_VIEW_MAP[sectionId] || 'home');
    ['ordersSection','reservationsSection','favoritesSection','rewardsSection',
      'offersSection','energySection','notificationsSection','settingsSection'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.style.removeProperty('display');
    });
    const preview = document.getElementById('dashboardPreview');
    const overview = document.getElementById('dashboardOverview');
    const twoCol = document.querySelector('#dashboardHome .two-col');
    if (preview) preview.style.removeProperty('display');
    if (overview) overview.style.removeProperty('display');
    if (twoCol) {
      twoCol.style.removeProperty('display');
      twoCol.style.removeProperty('grid-template-columns');
    }
    if (typeof setOrdersViewMode === 'function') setOrdersViewMode(sectionId === 'ordersSection');
    if (typeof setReservationsViewMode === 'function') setReservationsViewMode(sectionId === 'reservationsSection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof setActiveLink === 'function' && setActiveLink.length > 1) setActiveLink(event, sectionId);
    else setActiveLink(event);
    const CUSTOMER_NAMES = {
      dashboardHome: 'Dashboard',
      ordersSection: 'My Orders',
      reservationsSection: 'PC Builds & Support',
      favoritesSection: 'Wishlist',
      rewardsSection: 'Stackly Rewards',
      offersSection: 'Membership Plans',
      energySection: 'Purchase Insights',
      notificationsSection: 'Notifications',
      settingsSection: 'Settings'
    };
    updateBreadcrumb(CUSTOMER_NAMES[sectionId] || 'Dashboard');
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open') && typeof closeSidebar === 'function') closeSidebar();
    return;
  }

  const twoCol = document.querySelector('.two-col');

  
  if (sectionId === 'dashboardHome') {
    ALL_SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    if (twoCol) {
      twoCol.style.display = '';
      twoCol.style.gridTemplateColumns = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveLink(event);
    updateBreadcrumb('Dashboard');
    if (document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    if (document.getElementById('sidebar').classList.contains('open')) closeSidebar();
    return;
  }

  
  ALL_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? '' : 'none';
  });

  if (twoCol) {
    if (sectionId === 'ordersSection' || sectionId === 'reservationsSection') {
      twoCol.style.display = '';
      twoCol.style.gridTemplateColumns = '1fr';
    } else {
      twoCol.style.display = 'none';
    }
  }

  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = '';
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  setActiveLink(event);
  updateBreadcrumb(SECTION_NAMES[sectionId] || 'Dashboard');
  if (document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
  if (document.getElementById('sidebar').classList.contains('open')) closeSidebar();
}

function setActiveLink(event) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (event && event.currentTarget && event.currentTarget.classList.contains('sidebar-link')) {
    event.currentTarget.classList.add('active');
  }
}

function updateBreadcrumb(name) {
  const bc = document.getElementById('headerBreadcrumb');
  const ht = document.getElementById('headerTitle');
  if (bc) bc.textContent = 'Home / ' + name;
  if (ht) ht.textContent = name;
}


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle  = document.getElementById('menuToggle');
  if (!sidebar || !overlay || !toggle) return;
  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
  toggle.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('no-scroll', isOpen);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle  = document.getElementById('menuToggle');
  
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  if (toggle) {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  document.body.classList.remove('no-scroll');
}

window.addEventListener('resize', function() {
  if (window.innerWidth > 992) {
    closeSidebar();
  }
});

function handleLogout() {
  localStorage.removeItem('stackly_user');
  sessionStorage.removeItem('stackly_user');
  window.location.href = 'signin.html';
}


function show404() {
  window.location.href = '404.html';
}


function validateName(name) {
  return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 1;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone.replace(/\D/g, '').length === 10;
}

function handleSaveChanges(e) {
  e.preventDefault();
  
  const nameEl = document.getElementById('fullName');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  
  const nameVal = nameEl.value.trim();
  const emailVal = emailEl.value.trim();
  const phoneVal = phoneEl.value.trim();
  
  const nameGroup = document.getElementById('profileNameGroup');
  const emailGroup = document.getElementById('profileEmailGroup');
  const phoneGroup = document.getElementById('profilePhoneGroup');
  
  let isValid = true;
  
  if (!validateName(nameVal)) {
    nameGroup.classList.add('has-error');
    isValid = false;
  } else {
    nameGroup.classList.remove('has-error');
  }
  
  if (!validateEmail(emailVal)) {
    emailGroup.classList.add('has-error');
    isValid = false;
  } else {
    emailGroup.classList.remove('has-error');
  }
  
  if (!validatePhone(phoneVal)) {
    phoneGroup.classList.add('has-error');
    isValid = false;
  } else {
    phoneGroup.classList.remove('has-error');
  }
  
  if (isValid) {
    window.location.href = '404.html';
  }
}


const fullNameEl = document.getElementById('fullName');
if (fullNameEl) {
fullNameEl.addEventListener('blur', function() {
  const group = document.getElementById('profileNameGroup');
  if (this.value.trim() && !validateName(this.value.trim())) {
    group.classList.add('has-error');
  } else {
    group.classList.remove('has-error');
  }
});
}

const emailEl = document.getElementById('email');
if (emailEl) {
emailEl.addEventListener('blur', function() {
  const group = document.getElementById('profileEmailGroup');
  if (this.value.trim() && !validateEmail(this.value.trim())) {
    group.classList.add('has-error');
  } else {
    group.classList.remove('has-error');
  }
});
}

const phoneEl = document.getElementById('phone');
if (phoneEl) {
phoneEl.addEventListener('blur', function() {
  const group = document.getElementById('profilePhoneGroup');
  if (this.value.trim() && !validatePhone(this.value.trim())) {
    group.classList.add('has-error');
  } else {
    group.classList.remove('has-error');
  }
});
}


document.querySelectorAll('.settings-input-custom').forEach(input => {
  input.addEventListener('input', function() {
    const group = this.closest('.settings-field-custom');
    if (group) group.classList.remove('has-error');
  });
});


document.addEventListener('click', e => {
  const toggle = e.target.closest('.settings-toggle');
  if (toggle) toggle.classList.toggle('off');
});


document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
  const targetUrl = new URL(href, window.location.href);
  const isDash = targetUrl.pathname.endsWith('/customer-dashboard.html') ||
                 targetUrl.pathname.endsWith('/admin-dashboard.html');
  const isSafe = targetUrl.pathname.endsWith('/404.html') ||
                 targetUrl.pathname.endsWith('/signin.html');
  if (!isDash && !isSafe) {
    localStorage.removeItem('stackly_user');
    sessionStorage.removeItem('stackly_user');
  }
});
