// src/api/prediction.api.ts
import apiClient from './client';
import { API_CONFIG } from './config';
import {
  PredictionResult,
  PredictionHistory,
} from '../types/prediction.types';


class PredictionApi {
  /**
   * Dự đoán bệnh từ ảnh
   * @param imageUri - Local file URI
   * @returns PredictionResult
   */
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
        timeout: 60000, // 60s for ML inference
      }
    );
  }

  /**
   * Lấy lịch sử predictions (paginated)
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @returns { items, total, page, page_size }
   */
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

  /**
   * Lấy chi tiết một prediction
   * @param predictionId - UUID của prediction
   * @returns PredictionResult
   */
  async getDetail(predictionId: string): Promise<PredictionResult> {
    return apiClient.get<PredictionResult>(
      `${API_CONFIG.ENDPOINTS.PREDICTION_DETAIL}/${predictionId}`
    );
  }

  /**
   * Xóa một prediction
   * @param predictionId - UUID của prediction
   * @returns { msg: string }
   */
  async delete(predictionId: string): Promise<{ msg: string }> {
    return apiClient.delete<{ msg: string }>(
      `${API_CONFIG.ENDPOINTS.DELETE_PREDICTION}/${predictionId}`
    );
  }
}

export default new PredictionApi();