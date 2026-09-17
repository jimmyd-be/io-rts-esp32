export interface Types {
  ssid: string;
}

export interface otaKeyResponse {
  key: string;
}

export interface NetworkConfig {
  hostname: string;
  dhcp: boolean;
  ip: string;
  mask: string;
  gateway: string;
  dns1: string;
  dns2: string;
  sntp: string;
  actual_ip: string;
  actual_mask: string;
  actual_gateway: string;
  actual_dns1: string;
}

export interface FallBackConfig {
  enabled: boolean;
  retries_boot: number;
  retries_running: number;
  ap_timeout_s: number;
  ap_ssid: string;
  ap_running: boolean;
  connected: boolean;
}

export interface MqttConfig {
  user: string;
  server: string;
  port: number;
  password: string;
  client_id: string;
  topic: string;
  discovery: string;
  connected: boolean;
  enabled: boolean;
  status: string;
}
