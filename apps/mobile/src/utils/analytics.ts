import axios from 'axios';

const API_URL = 'https://praiseimpact.vercel.app';

export const trackEvent = async (type: string, sermonId?: string, meta?: any) => {
  try {
    // In a real app, you'd get the userId from state/storage
    const userId = null; 
    
    await axios.post(`${API_URL}/analytics/event`, {
      type,
      userId,
      sermonId,
      meta,
    });
  } catch (error) {
    console.log('Analytics tracking failed', error);
  }
};
