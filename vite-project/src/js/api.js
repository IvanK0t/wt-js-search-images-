import axios from 'axios';

// Pexels API - простий та надійний
const PEXELS_API_KEY = 'scEY3rHQRlK7KHfGq5DBTQ95Lla7TLlkT0K47P6YqXkdnUqYq3ELhHFv';
const BASE_URL = 'https://api.pexels.com/v1/search';

export async function fetchImages(query, page = 1) {
  try {
    console.log('📡 API запрос до Pexels:', { query, page });
    
    const config = {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    };
    
    const params = {
      query,
      page,
      per_page: 40,
    };

    const response = await axios.get(BASE_URL, { params, ...config });
    
    console.log('✅ Відповідь від API:', response.data);
    
    if (!response.data || !response.data.photos) {
      throw new Error('Немає фото в відповіді');
    }
    
    // Трансформуємо відповідь Pexels у формат Pixabay для сумісності
    const formattedData = {
      hits: response.data.photos.map(img => ({
        id: img.id,
        webformatURL: img.src.medium,
        largeImageURL: img.src.large,
        tags: img.photographer || 'Photo',
        likes: 0,
        views: 0,
        comments: 0,
        downloads: 0,
      })),
      totalHits: response.data.total_results || 0,
    };
    
    return formattedData;
  } catch (error) {
    console.error('❌ API Помилка:', error.response?.data || error.message);
    throw error;
  }
}
