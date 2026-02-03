import { LocalData, GameSettings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'subway_runners_data';

function generateGuestId(): string {
  return 'guest_' + crypto.randomUUID();
}

function getDefaultData(): LocalData {
  return {
    highScore: 0,
    totalCoins: 0,
    guestId: generateGuestId(),
    guestUsername: null,
    settings: DEFAULT_SETTINGS,
  };
}

export function loadLocalData(): LocalData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<LocalData>;
      return {
        highScore: parsed.highScore ?? 0,
        totalCoins: parsed.totalCoins ?? 0,
        guestId: parsed.guestId ?? generateGuestId(),
        guestUsername: parsed.guestUsername ?? null,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      };
    }
  } catch (e) {
    console.warn('Failed to load local data:', e);
  }
  return getDefaultData();
}

export function saveLocalData(data: LocalData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save local data:', e);
  }
}

export function updateHighScore(score: number): boolean {
  const data = loadLocalData();
  if (score > data.highScore) {
    data.highScore = score;
    saveLocalData(data);
    return true;
  }
  return false;
}

export function addCoins(amount: number): void {
  const data = loadLocalData();
  data.totalCoins += amount;
  saveLocalData(data);
}

export function setGuestUsername(username: string): void {
  const data = loadLocalData();
  data.guestUsername = username;
  saveLocalData(data);
}

export function updateSettings(settings: Partial<GameSettings>): void {
  const data = loadLocalData();
  data.settings = { ...data.settings, ...settings };
  saveLocalData(data);
}

export function getGuestId(): string {
  return loadLocalData().guestId;
}
