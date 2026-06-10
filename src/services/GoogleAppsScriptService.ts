export const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbz.../exec";

export const executeAppsScript = async (action: string, payload: any = {}) => {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...payload })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error executing Apps Script:", error);
    throw error;
  }
};
