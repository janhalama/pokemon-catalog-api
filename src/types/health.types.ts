export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface HealthResponse {
  success: boolean;
  data: HealthStatus;
} 