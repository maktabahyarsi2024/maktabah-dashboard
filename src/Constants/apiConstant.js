const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_CONFIG = {
  BIBLIOGRAPHIES: `${BASE_URL}/maktabah/bibliographies`,
  TOTAL_BIBLIOGRAPHIES: `${BASE_URL}/maktabah/total-bibliographies`,
  BIBLIOGRAPHY: `${BASE_URL}/maktabah/bibliography`,
  CATEGORIES: `${BASE_URL}/maktabah/categories`,
  TOTAL_CATEGORIES: `${BASE_URL}/maktabah/totalCategories`,
  CATEGORY: `${BASE_URL}/maktabah/categories`,
  CONTENT: `${BASE_URL}/maktabah/contents`,
  CONTENT_WITHOUT_MAKTABAH: `${BASE_URL}/contents`,
  TABLE_OF_CONTENT: `${BASE_URL}/maktabah/table-of-contents`,
  IMAGES: `${BASE_URL}/maktabah/images`,
  SIGNIN: `${BASE_URL}/maktabah/signin`,
  CHANGE_PUBLISHED_STATUS: `${BASE_URL}/maktabah/bibliographies/published`,
  USERS: `${BASE_URL}/maktabah/users`,
  SIGN_UP: `${BASE_URL}/maktabah/auth/signup`
};

export default API_CONFIG;
