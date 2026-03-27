import './style.css'
import 'izitoast/dist/css/iziToast.min.css'
import 'simplelightbox/dist/simple-lightbox.min.css'
import iziToast from 'izitoast'
import SimpleLightbox from 'simplelightbox'
import { fetchImages } from './js/api.js'

console.log('✅ Скрипт загружен');

// Елементи форми та галереї
const searchForm = document.getElementById('search-form')
const gallery = document.getElementById('gallery')
const loadMoreBtn = document.getElementById('load-more')
const loader = document.getElementById('loader')

console.log('✅ Элементи найдены:', { 
  searchForm: !!searchForm, 
  gallery: !!gallery, 
  loadMoreBtn: !!loadMoreBtn, 
  loader: !!loader 
})

// Змінні стану
let currentQuery = ''
let currentPage = 1
let isLoading = false

// Функція для показу лоадера
function showLoader() {
  loader.hidden = false
}

function hideLoader() {
  loader.hidden = true
}

// Функція для рендерингу галереї
function renderGallery(images) {
  return images
    .map(
      img => `
      <a href="${img.largeImageURL}" class="gallery-item">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        <div class="info">
          <p><span>❤️ ${img.likes}</span></p>
          <p><span>👁️ ${img.views}</span></p>
          <p><span>💬 ${img.comments}</span></p>
          <p><span>⬇️ ${img.downloads}</span></p>
        </div>
      </a>`
    )
    .join('')
}

// Функція пошуку
async function searchImages(e) {
  e.preventDefault()
  
  const query = searchForm.elements.query.value.trim()
  
  console.log('🔍 Пошук:', query);
  
  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Будь ласка, введіть що-небудь для пошуку',
    })
    return
  }
  
  //очищення галереї при новому пошуку
  currentQuery = query
  currentPage = 1
  gallery.innerHTML = ''
  loadMoreBtn.hidden = true
  
  try {
    showLoader()
    console.log('📡 Запрос до API...');
    const data = await fetchImages(query, currentPage)
    
    console.log('✅ Отримано:', data);
    
    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        message: 'Вибачте, немає зображень за вашим запитом.',
      })
      hideLoader()
      return
    }
    
    const html = renderGallery(data.hits)
    gallery.insertAdjacentHTML('beforeend', html)
    
    console.log('🎨 Галерея оновлена');
    
    // Оновлюємо лайтбокс
    updateLightbox()
    
    // Показуємо кнопку Load More, якщо є ще результати
    if (data.totalHits > 40) {
      loadMoreBtn.hidden = false
    }
    
    iziToast.success({
      message: `Ура! Ми знайшли ${data.totalHits} зображень.`,
    })
    
    // sole.error('❌ Помилка пошуку:', error)
    iziToast.error({
      message: 'Помилка при пошуку: ' + error.message,
    })
  } finally {
    hideLoader()
  }
}

// Функція завантаження більше зображень
async function loadMore() {
  if (isLoading) return
  
  currentPage++
  isLoading = true
  
  try {
    showLoader()
    const data = await fetchImages(currentQuery, currentPage)
    
    if (data.hits.length === 0) {
      loadMoreBtn.hidden = true
      iziToast.error({
        message: 'Вибачте, немає зображень за вашим запитом.',
      })
      return
    }
    
    const html = renderGallery(data.hits)
    gallery.insertAdjacentHTML('beforeend', html)
    
    // Оновлюємо лайтбокс
    updateLightbox()
    
    // Показуємо кнопку Load More, якщо
  } catch (error) {
    console.error('Помилка завантаження:', error)
    iziToast.error({
      message: 'Вибачте, немає зображень за вашим запитом.',
    })
    currentPage-- // Повертаємо до попередньої сторінки при помилці
  } finally {
    hideLoader()
    isLoading = false
  }
}

// Вішаємо обробники подій
searchForm.addEventListener('submit', searchImages)
loadMoreBtn.addEventListener('click', loadMore)
