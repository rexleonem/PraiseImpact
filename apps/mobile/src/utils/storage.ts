import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data', error);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached data', error);
    return null;
  }
};

export const savePlaybackPosition = async (sermonId: string, position: number) => {
  try {
    await AsyncStorage.setItem(`playback_${sermonId}`, position.toString());
  } catch (error) {
    console.error('Error saving playback position', error);
  }
};

export const getPlaybackPosition = async (sermonId: string) => {
  try {
    const pos = await AsyncStorage.getItem(`playback_${sermonId}`);
    return pos ? parseInt(pos) : 0;
  } catch (error) {
    console.error('Error getting playback position', error);
    return 0;
  }
};
