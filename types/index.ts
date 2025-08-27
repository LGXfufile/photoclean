export interface DetectedPerson {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  selected: boolean;
}

export interface ProcessingStep {
  step: 'upload' | 'detect' | 'process' | 'complete';
  progress: number;
  message: string;
}

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}