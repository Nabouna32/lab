import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateIpv4Subnet } from "./ip-subnet-calculator.ts";

describe("calculateIpv4Subnet", () => {
  it("calculates a standard /24 subnet", () => {
    assert.deepEqual(calculateIpv4Subnet("192.168.1.42/24"), {
      input: "192.168.1.42/24",
      address: "192.168.1.42",
      prefix: 24,
      subnetMask: "255.255.255.0",
      wildcardMask: "0.0.0.255",
      networkAddress: "192.168.1.0",
      broadcastAddress: "192.168.1.255",
      firstUsableAddress: "192.168.1.1",
      lastUsableAddress: "192.168.1.254",
      totalAddresses: 256,
      usableHosts: 254,
    });
  });

  it("handles /31 and /32 without applying the traditional network/broadcast subtraction", () => {
    const pointToPoint = calculateIpv4Subnet("10.0.0.8/31");
    assert.equal(pointToPoint?.totalAddresses, 2);
    assert.equal(pointToPoint?.usableHosts, 2);
    assert.equal(pointToPoint?.firstUsableAddress, "10.0.0.8");
    assert.equal(pointToPoint?.lastUsableAddress, "10.0.0.9");

    const singleHost = calculateIpv4Subnet("10.0.0.9/32");
    assert.equal(singleHost?.totalAddresses, 1);
    assert.equal(singleHost?.usableHosts, 1);
    assert.equal(singleHost?.firstUsableAddress, "10.0.0.9");
    assert.equal(singleHost?.lastUsableAddress, "10.0.0.9");
  });

  it("handles the /0 boundary", () => {
    const result = calculateIpv4Subnet("10.20.30.40/0");

    assert.equal(result?.subnetMask, "0.0.0.0");
    assert.equal(result?.wildcardMask, "255.255.255.255");
    assert.equal(result?.networkAddress, "0.0.0.0");
    assert.equal(result?.broadcastAddress, "255.255.255.255");
    assert.equal(result?.totalAddresses, 2 ** 32);
  });

  it("normalizes whitespace and the host address", () => {
    const result = calculateIpv4Subnet("  192.168.10.99/16  ");

    assert.equal(result?.input, "192.168.10.99/16");
    assert.equal(result?.address, "192.168.10.99");
    assert.equal(result?.networkAddress, "192.168.0.0");
  });

  it("rejects malformed IPv4 addresses and prefixes", () => {
    for (const input of [
      "",
      "192.168.1.1",
      "192.168.1.1/33",
      "192.168.1.256/24",
      "192.168.1/24",
      "192.168.1.1/abc",
    ]) {
      assert.equal(calculateIpv4Subnet(input), null, input);
    }
  });
});
