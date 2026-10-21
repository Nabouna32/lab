export type WifiSecurity = "WPA" | "WEP" | "nopass";

export type WifiQrOptions = {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
};

/** Escapes reserved characters in the standard WIFI: QR payload format. */
export function escapeWifiValue(value: string): string {
  return value
    .replace(/([\\\\;,:"])/g, "\\\\$1")
    .replace(/\r/g, "\\\\r")
    .replace(/\n/g, "\\\\n");
}

/** Returns null until the network name and any required password are provided. */
export function buildWifiQrPayload({ ssid, password, security, hidden }: WifiQrOptions): string | null {
  if (ssid.length === 0 || (security !== "nopass" && password.length === 0)) return null;

  return `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${security === "nopass" ? "" : escapeWifiValue(password)};H:${hidden ? "true" : "false"};;`;
}
