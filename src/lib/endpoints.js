const API_BASE_URL = "http://76.13.23.68:8990/api/v1";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth-user/login/admin`,
  USERS_GET_THERAPISTS_LIST: `${API_BASE_URL}/employee/therapist`,
  USER_GET_DETAIL_THERAPIST: `${API_BASE_URL}/employee/therapist/:code`,
  UPDATE_THERAPIST_STATUS: `${API_BASE_URL}/employee/onboarding/approval/:therapistCode`,
  GET_BOOKING_LIST: `${API_BASE_URL}/booking-management`,
};
