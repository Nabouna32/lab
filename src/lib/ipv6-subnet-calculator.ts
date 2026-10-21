export type Ipv6Subnet = {
  input: string;
  address: string;
  prefix: number;
  networkAddress: string;
  lastAddress: string;
  addressCount: bigint;
};

function parseIpv6(value: string): bigint | null {
  if (!value || value.includes("%") || value.includes(".")) return null;
  if ((value.match(/::/g) ?? []).length > 1) return null;

  const hasCompression = value.includes("::");
  const [leftText, rightText = ""] = hasCompression ? value.split("::") : [value, ""];
  const left = leftText ? leftText.split(":") : [];
  const right = rightText ? rightText.split(":") : [];
  const groups = [...left, ...right];

  if (hasCompression ? groups.length >= 8 : groups.length !== 8) return null;
  if (groups.some((group) => !/^[0-9a-fA-F]{1,4}$/.test(group))) return null;

  const missing = hasCompression ? 8 - groups.length : 0;
  const expanded = [...left, ...Array.from({ length: missing }, () => "0"), ...right];
  if (expanded.length !== 8) return null;

  return expanded.reduce((address, group) => (address << BigInt(16)) | BigInt(Number.parseInt(group, 16)), BigInt(0));
}

function formatIpv6(value: bigint): string {
  const groups = Array.from({ length: 8 }, (_, index) =>
    Number((value >> BigInt((7 - index) * 16)) & BigInt(65535)).toString(16),
  );

  let bestStart = -1;
  let bestLength = 1;
  for (let index = 0; index < groups.length;) {
    if (groups[index] !== "0") {
      index += 1;
      continue;
    }
    let end = index;
    while (end < groups.length && groups[end] === "0") end += 1;
    if (end - index > bestLength) {
      bestStart = index;
      bestLength = end - index;
    }
    index = end;
  }

  if (bestStart === -1) return groups.join(":");
  const left = groups.slice(0, bestStart).join(":");
  const right = groups.slice(bestStart + bestLength).join(":");
  return left && right ? `${left}::${right}` : left ? `${left}::` : right ? `::${right}` : "::";
}

export function calculateIpv6Subnet(input: string): Ipv6Subnet | null {
  const trimmed = input.trim();
  const match = /^(.+)\/(\d{1,3})$/.exec(trimmed);
  if (!match) return null;

  const address = parseIpv6(match[1]);
  const prefix = Number(match[2]);
  if (address === null || prefix < 0 || prefix > 128) return null;

  const hostBits = BigInt(128 - prefix);
  const network = (address >> hostBits) << hostBits;
  const hostMask = (BigInt(1) << hostBits) - BigInt(1);
  const last = network | hostMask;

  return {
    input: `${formatIpv6(address)}/${prefix}`,
    address: formatIpv6(address),
    prefix,
    networkAddress: `${formatIpv6(network)}/${prefix}`,
    lastAddress: formatIpv6(last),
    addressCount: BigInt(1) << hostBits,
  };
}
