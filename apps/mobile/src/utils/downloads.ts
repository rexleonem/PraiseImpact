import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DOWNLOADS_KEY = 'downloaded_sermons';

export async function downloadSermonAudio(sermonId: string, url: string) {
  const fileUri = FileSystem.documentDirectory + `${sermonId}.mp3`;
  
  try {
    const downloadRes = await FileSystem.downloadAsync(url, fileUri);
    
    // Save to metadata
    const downloads = await getDownloads();
    downloads[sermonId] = downloadRes.uri;
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
    
    return downloadRes.uri;
  } catch (error) {
    console.error('Download failed', error);
    throw error;
  }
}

export async function getDownloads() {
  const data = await AsyncStorage.getItem(DOWNLOADS_KEY);
  return data ? JSON.parse(data) : {};
}

export async function getLocalUri(sermonId: string) {
  const downloads = await getDownloads();
  return downloads[sermonId] || null;
}

export async function deleteDownload(sermonId: string) {
  try {
    const fileUri = FileSystem.documentDirectory + `${sermonId}.mp3`;
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    
    const downloads = await getDownloads();
    delete downloads[sermonId];
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  } catch (error) {
    console.error('Delete failed', error);
  }
}
