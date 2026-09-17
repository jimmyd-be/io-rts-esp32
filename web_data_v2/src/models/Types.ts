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
