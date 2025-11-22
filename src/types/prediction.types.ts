// src/types/prediction.types.ts


export type DiseaseType = 'CNV' | 'DME' | 'DRUSEN' | 'NORMAL';

export interface DiseaseInfo {
  label: DiseaseType;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}


export interface PredictionResult {
  id: string;
  user_id: string;
  
  // Kết quả dự đoán
  predicted_class: DiseaseType;
  confidence: number; // 0-1
  probabilities: {
    CNV: number;
    DME: number;
    DRUSEN: number;
    NORMAL: number;
  };
  
  // Metadata
  image_url: string;
  inference_time: number; // ms
  created_at: string;
  

  heatmap_url?: string;
}


export interface PredictionHistory {
  id: string;
  user_id: string;
  predicted_class: DiseaseType;
  confidence: number;
  thumbnail_url: string;
  created_at: string;
}


export interface PredictResponse {
  success: boolean;
  data?: PredictionResult;
  message: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: PredictionHistory[];
  total: number;
  page: number;
  page_size: number;
  message: string;
}


export const DISEASE_INFO: Record<DiseaseType, DiseaseInfo> = {
  CNV: {
    label: 'CNV',
    name: 'Choroidal Neovascularization',
    description: 'Abnormal blood vessel growth in the choroid layer',
    severity: 'high',
  },
  DME: {
    label: 'DME',
    name: 'Diabetic Macular Edema',
    description: 'Fluid accumulation in the macula due to diabetes',
    severity: 'high',
  },
  DRUSEN: {
    label: 'DRUSEN',
    name: 'Drusen',
    description: 'Yellow deposits under the retina',
    severity: 'medium',
  },
  NORMAL: {
    label: 'NORMAL',
    name: 'Normal',
    description: 'No abnormalities detected',
    severity: 'none',
  },
};


export const DISEASE_COLORS: Record<DiseaseType, string> = {
  CNV: '#EF4444',      // Red
  DME: '#F59E0B',      // Orange
  DRUSEN: '#3B82F6',   // Blue
  NORMAL: '#10B981',   // Green
};