export type Ipv4Subnet = {
  input: string;
  address: string;
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableAddress: string;
  lastUsableAddress: string;
  totalAddresses: number;
  usableHosts: number;
};

function parseIpv4(value: string): number[] | null {
  const parts = value.trim().split(".");
  if (parts.length !== 4) return null;

  const octets = parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) return null;
    const number = Number(part);
    return number >= 0 && number <= 255 ? number : null;
  });

  return octets.every((octet) => octet !== null) ? (octets as number[]) : null;
}

function toUint32(octets: number[]): number {
  return (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function fromUint32(value: number): string {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}

function maskFromPrefix(prefix: number): number {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function calculateIpv4Subnet(input: string): Ipv4Subnet | null {
  const trimmed = input.trim();
  const match = /^([^/]+)\/(\d{1,2})$/.exec(trimmed);
  if (!match) return null;

  const octets = parseIpv4(match[1]);
  const prefix = Number(match[2]);
  if (!octets || prefix < 0 || prefix > 32) return null;

  const addressInt = toUint32(octets);
  const mask = maskFromPrefix(prefix);
  const network = (addressInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  const usableHosts =
    prefix <= 30 ? totalAddresses - 2 :
    prefix === 31 ? 2 :
    1;

  const firstUsableAddress = prefix <= 30
    ? fromUint32((network + 1) >>> 0)
    : fromUint32(network);

  const lastUsableAddress = prefix <= 30
    ? fromUint32((broadcast - 1) >>> 0)
    : fromUint32(broadcast);

  return {
    input: trimmed,
    address: fromUint32(addressInt),
    prefix,
    subnetMask: fromUint32(mask),
    wildcardMask: fromUint32((~mask) >>> 0),
    networkAddress: fromUint32(network),
    broadcastAddress: fromUint32(broadcast),
    firstUsableAddress,
    lastUsableAddress,
    totalAddresses,
    usableHosts,
  };
}
