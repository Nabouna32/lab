import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateIpv6Subnet } from "./ipv6-subnet-calculator.ts";

describe("calculateIpv6Subnet", () => {
  it("calculates a typical /64 and compresses addresses canonically", () => {
    assert.deepEqual(calculateIpv6Subnet("2001:0db8:0000:0000:0000:0000:0000:1234/64"), {
      input: "2001:db8::1234/64",
      address: "2001:db8::1234",
      prefix: 64,
      networkAddress: "2001:db8::/64",
      lastAddress: "2001:db8::ffff:ffff:ffff:ffff",
      addressCount: 1n << 64n,
    });
  });

  it("handles full-range /0 and exact-host /128 prefixes", () => {
    const all = calculateIpv6Subnet("2001:db8::1/0");
    assert.equal(all?.networkAddress, "::/0");
    assert.equal(all?.lastAddress, "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    assert.equal(all?.addressCount, 1n << 128n);

    const host = calculateIpv6Subnet("2001:db8::abcd/128");
    assert.equal(host?.networkAddress, "2001:db8::abcd/128");
    assert.equal(host?.lastAddress, "2001:db8::abcd");
    assert.equal(host?.addressCount, 1n);
  });

  it("handles compression at either end and ties by choosing the first longest zero run", () => {
    assert.equal(calculateIpv6Subnet("::1/128")?.address, "::1");
    assert.equal(calculateIpv6Subnet("2001:db8::/32")?.networkAddress, "2001:db8::/32");
    assert.equal(calculateIpv6Subnet("2001:0:0:1:0:0:1:1/128")?.address, "2001::1:0:0:1:1");
  });

  it("rejects invalid addresses, compression and prefixes", () => {
    for (const input of [
      "", "2001:db8::1", "2001:::1/64", "2001::db8::1/64", "2001:db8::1/129",
      "2001:db8::1/-1", "2001:db8::gg/64", "1:2:3:4:5:6:7:8:9/64",
      "1:2:3:4:5:6:7/64", "::ffff:192.0.2.1/128", "fe80::1%eth0/64",
    ]) assert.equal(calculateIpv6Subnet(input), null, input);
  });
});
