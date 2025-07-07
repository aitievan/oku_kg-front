import axios from 'axios';

const API_URL = 'https://oku-kg.onrender.com/api/admin/publishers';

export const getPublishers = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching publishers:', error);
    return [];
  }
};

export const getPublisherById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching publisher with id ${id}:`, error);
    throw error;
  }
};

export const addPublisher = async (publisherData, token) => {
  try {
    const response = await axios.post(API_URL, publisherData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding publisher:', error);
    throw error;
  }
};

export const updatePublisher = async (id, publisherData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, publisherData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating publisher with id ${id}:`, error);
    throw error;
  }
};

export const deletePublisher = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting publisher with id ${id}:`, error);
    throw error;
  }
};