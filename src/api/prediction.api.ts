import apiClient from './client';
import { API_CONFIG } from './config';
import {
  PredictionResult,
  PredictionHistory,
} from '../types/prediction.types';


class PredictionApi {

  async predict(imageUri: string): Promise<PredictionResult> {
    const formData = new FormData();
    
    const imageFile = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'oct_scan.jpg',
    };
    
    formData.append('image', imageFile as any);

    return apiClient.post<PredictionResult>(
      API_CONFIG.ENDPOINTS.PREDICT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, 
      }
    );
  }


  async getHistory(
    page: number,
    pageSize: number
  ): Promise<{
    items: PredictionHistory[];
    total: number;
    page: number;
    page_size: number;
  }> {
    return apiClient.get<{
      items: PredictionHistory[];
      total: number;
      page: number;
      page_size: number;
    }>(API_CONFIG.ENDPOINTS.PREDICTION_HISTORY, {
      params: { page, page_size: pageSize },
    });
  }


  async getDetail(predictionId: string): Promise<PredictionResult> {
    return apiClient.get<PredictionResult>(
      `${API_CONFIG.ENDPOINTS.PREDICTION_DETAIL}/${predictionId}`
    );
  }


  async delete(predictionId: string): Promise<{ msg: string }> {
    return apiClient.delete<{ msg: string }>(
      `${API_CONFIG.ENDPOINTS.DELETE_PREDICTION}/${predictionId}`
    );
  }
}

export default new PredictionApi();