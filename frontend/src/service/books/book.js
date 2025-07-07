import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/public/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    throw error;
  }
};

export const getBooksByGenre = async (genreId) => {
  try {
    const response = await axios.get(`${API_URL}/public/books/genre/${genreId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books for genre ${genreId}:`, error);
    throw error;
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/public/books/search?title=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching for books with query "${query}":`, error);
    throw error;
  }
};

export const smartSearchBooks = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/public/books/smart-search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error performing smart search for books with query "${query}":`, error);
    throw error;
  }
};

export const getBooksByTag = async (tagId) => {
  try {
    const response = await axios.get(`${API_URL}/public/books/tag/${tagId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books for tag ${tagId}:`, error);
    throw error;
  }
};
export const getAllTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/books/tags`);
    return response.data;
  } catch (error) {
    console.error('Ката: тегдерди алуу:', error);
    throw error;
  }
};

export const getBooksByTagName = async (tagName) => {
  try {
    const tagsResponse = await axios.get(`${API_URL}/public/books/tags`);
    const tag = tagsResponse.data.find(t => t.name === tagName);

    if (tag) {
      const booksResponse = await axios.get(`${API_URL}/public/books/tags/${tag.tagId}`);
      return booksResponse.data;
    }

    return [];
  } catch (error) {
    console.error(`Ката: "${tagName}" тегиндеги китептерди алуу:`, error);
    return [];
  }
};
export const getDiscountBanners = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/books/discounts`);
    return response.data;
  } catch (error) {
    console.error('Ката кетти баннерди алууда:', error);
    throw error;
  }
};
