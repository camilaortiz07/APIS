const API_KEY = 'bpEBJTcX7PxXh2nK98NgWdwLJKYKPBLY7dCEgfyeCRl1A5C2Euk3aKO3';
const BASE_URL = 'https://api.pexels.com/v1';
const PER_PAGE = 10;

let currentPage = 1;
let totalPages = 1;
let currentPhotos = [];
let currentLightboxIndex = 0;

// ============ ELEMENTOS DEL DOM ============

const galleryEl = document.getElementById('gallery');
const paginationEl = document.getElementById('pagination');
const loaderEl = document.getElementById('loader');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxPhotographer = document.getElementById('lightbox-photographer');
const lightboxDimensions = document.getElementById('lightbox-dimensions');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const themeToggle = document.getElementById('theme-toggle');

// ============ DARK / LIGHT MODE ============

function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

initTheme();

// ============ FETCH CON PROMESAS Y ASYNC/AWAIT ============

async function fetchPhotos(page = 1) {
  showLoader(true);

  try {
    const response = await fetch(`${BASE_URL}/curated?per_page=${PER_PAGE}&page=${page}`, {
      headers: {
        Authorization: API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    currentPhotos = data.photos;
    totalPages = Math.ceil(data.total_results / PER_PAGE);
    currentPage = page;

    renderGallery(currentPhotos);
    renderPagination();
  } catch (error) {
    galleryEl.innerHTML = `
      <div class="error-message">
        <h3>No se pudieron cargar las fotos</h3>
        <p>${error.message}</p>
        <button class="retry-btn" onclick="fetchPhotos(${page})">Reintentar</button>
      </div>
    `;
  } finally {
    showLoader(false);
  }
}

function showLoader(visible) {
  loaderEl.classList.toggle('active', visible);
  galleryEl.style.opacity = visible ? '0.3' : '1';
}

// ============ RENDERIZADO DE GALERÍA ============

function renderGallery(photos) {
  galleryEl.innerHTML = '';

  photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${index * 0.06}s`;

    item.innerHTML = `
      <img
        src="${photo.src.large}"
        alt="${photo.alt || 'Foto de Pexels'}"
        loading="lazy"
      >
      <div class="overlay">
        <div class="overlay-info">
          <h3 class="overlay-title">${photo.alt || 'Sin título'}</h3>
          <p class="overlay-photographer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${photo.photographer}
          </p>
        </div>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(index));
    galleryEl.appendChild(item);
  });
}

// ============ PAGINACIÓN ============

function renderPagination() {
  paginationEl.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn page-arrow';
  prevBtn.innerHTML = '&#10094;';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  paginationEl.appendChild(prevBtn);

  const pages = getPageRange(currentPage, totalPages);

  pages.forEach(p => {
    if (p === '...') {
      const dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '...';
      paginationEl.appendChild(dots);
    } else {
      const btn = document.createElement('button');
      btn.className = `page-btn ${p === currentPage ? 'active' : ''}`;
      btn.textContent = p;
      btn.addEventListener('click', () => goToPage(p));
      paginationEl.appendChild(btn);
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn page-arrow';
  nextBtn.innerHTML = '&#10095;';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  paginationEl.appendChild(nextBtn);
}

function getPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}

function goToPage(page) {
  if (page < 1 || page > totalPages || page === currentPage) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => fetchPhotos(page), 300);
}

// ============ LIGHTBOX ============

function openLightbox(index) {
  currentLightboxIndex = index;
  const photo = currentPhotos[index];

  lightboxImg.src = photo.src.large2x;
  lightboxImg.alt = photo.alt || 'Foto de Pexels';
  lightboxTitle.textContent = photo.alt || 'Sin título';
  lightboxPhotographer.textContent = photo.photographer;
  lightboxDimensions.textContent = `${photo.width} × ${photo.height}`;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentLightboxIndex = (currentLightboxIndex + direction + currentPhotos.length) % currentPhotos.length;
  openLightbox(currentLightboxIndex);
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  navigateLightbox(-1);
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  navigateLightbox(1);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ============ INICIALIZACIÓN ============

fetchPhotos(1);
