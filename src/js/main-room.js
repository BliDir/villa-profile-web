import './nav-scroll.js';
import './nav.js';
import './room-gallery.js';
import './animations.js';
import { initI18n } from './i18n.js';

// Room pages have no #hero — nav must always be opaque
document.querySelector('header')?.classList.add('is-scrolled');
initI18n();
