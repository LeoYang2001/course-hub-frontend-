// LocalStorage helpers
export function loadData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
