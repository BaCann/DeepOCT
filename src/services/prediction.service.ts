import predictionApi from '../api/prediction.api';
import {
  PredictResponse,
  HistoryResponse,
} from '../types/prediction.types';
import { AxiosError } from 'axios';


class PredictionService {

  async predict(imageUri: string): Promise<PredictResponse> {
    try {
      if (!imageUri || imageUri.trim() === '') {
        return {
          success: false,
          message: 'Image is required',
        };
      }

      if (!imageUri.startsWith('file://') && !imageUri.startsWith('content://')) {
        return {
          success: false,
          message: 'Invalid image URI format',
        };
      }

      const data = await predictionApi.predict(imageUri);

      return {
        success: true,
        data: data,
        message: 'Prediction successful',
      };
    } catch (error) {
      return {
        success: false,
        message: this.handleError(error),
      };
    }
  }


  async getHistory(
    page: number = 1,
    pageSize: number = 20
  ): Promise<HistoryResponse> {
    try {
      if (page < 1) page = 1;
      if (pageSize < 1 || pageSize > 100) pageSize = 20;

      const response = await predictionApi.getHistory(page, pageSize);

      return {
        success: true,
        data: response.items,
        total: response.total,
        page: response.page,
        page_size: response.page_size,
        message: 'History loaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        total: 0,
        page: page,
        page_size: pageSize,
        message: this.handleError(error),
      };
    }
  }

  async getDetail(predictionId: string): Promise<PredictResponse> {
    try {
      if (!predictionId || predictionId.trim() === '') {
        return {
          success: false,
          message: 'Prediction ID is required',
        };
      }

      const data = await predictionApi.getDetail(predictionId);

      return {
        success: true,
        data: data,
        message: 'Prediction detail loaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: this.handleError(error),
      };
    }
  }


  async delete(predictionId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!predictionId || predictionId.trim() === '') {
        return {
          success: false,
          message: 'Prediction ID is required',
        };
      }

      const response = await predictionApi.delete(predictionId);

      return {
        success: true,
        message: response.msg || 'Prediction deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: this.handleError(error),
      };
    }
  }


  private handleError(error: unknown): string {
    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail;

        if (status === 400) {
          return typeof detail === 'string' 
            ? detail 
            : 'Invalid image. Please try another image.';
        } else if (status === 401 || status === 403) {
          return 'Authentication required. Please login again.';
        } else if (status === 404) {
          return 'Prediction not found.';
        } else if (status === 413) {
          return 'Image file is too large. Maximum size is 10MB.';
        } else if (status === 500) {
          return 'Server error. Please try again later.';
        } else if (status === 503) {
          return 'Service temporarily unavailable. Please try again later.';
        } else {
          return typeof detail === 'string' 
            ? detail 
            : 'An error occurred. Please try again.';
        }
      } else if (error.request) {
        return 'Cannot connect to server. Please check your internet connection.';
      }
    }
    return 'An unexpected error occurred';
  }
}

export default new PredictionService();