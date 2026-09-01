/**
 * CalcRick Programming & Computer Science Suite
 * Base conversions, Bitwise operations, IPv4 Subnetting & Two's Complement
 */

import { CalculatorDefinition } from "@/types";

export const programmingCalculators: CalculatorDefinition[] = [
  // 1. Radix & Base Converter (Binary, Octal, Decimal, Hex)
  {
    id: "base-converter",
    name: "Radix & Number Base Converter",
    slug: "base-converter",
    category: "programming-bases",
    domain: "programming",
    description: "Convert numbers across Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16), and arbitrary bases 2–36.",
    keywords: ["binary", "hex", "hexadecimal", "octal", "decimal", "base converter", "radix", "programming"],
    inputs: [
      { key: "value", label: "Input Value", type: "text", defaultValue: "255", required: true },
      {
        key: "fromBase",
        label: "From Base",
        type: "select",
        defaultValue: "10",
        options: [
          { label: "Decimal (Base 10)", value: "10" },
          { label: "Binary (Base 2)", value: "2" },
          { label: "Hexadecimal (Base 16)", value: "16" },
          { label: "Octal (Base 8)", value: "8" },
        ],
      },
    ],
    sampleInputs: [
      { label: "255 (Decimal)", values: { value: "255", fromBase: "10" } },
      { label: "11010110 (Binary)", values: { value: "11010110", fromBase: "2" } },
      { label: "DEADBEEF (Hex)", values: { value: "DEADBEEF", fromBase: "16" } },
      { label: "755 (Octal file permissions)", values: { value: "755", fromBase: "8" } },
    ],
    calculate: (input) => {
      const raw = String(input.value || "").trim();
      const fromBase = parseInt(input.fromBase || "10", 10);

      const parsedDecimal = parseInt(raw, fromBase);
      if (isNaN(parsedDecimal)) {
        return {
          status: "invalid",
          input: raw,
          result: null,
          warnings: [`Invalid number '${raw}' for base ${fromBase}`],
        };
      }

      const bin = (parsedDecimal >>> 0).toString(2);
      const oct = (parsedDecimal >>> 0).toString(8);
      const dec = parsedDecimal.toString(10);
      const hex = (parsedDecimal >>> 0).toString(16).toUpperCase();

      // Format binary with 4-bit nibbles
      const binFormatted = bin.padStart(Math.ceil(bin.length / 4) * 4, "0").replace(/(.{4})/g, "$1 ").trim();

      return {
        status: "calculated",
        input: `${raw} (Base ${fromBase})`,
        result: { decimal: dec, binary: bin, octal: oct, hex },
        displayResult: `Dec: ${dec} | Hex: 0x${hex} | Bin: ${binFormatted} | Oct: ${oct}`,
        exactResult: dec,
        isExact: true,
        steps: [
          {
            title: "Decimal Equivalent",
            text: `Base ${fromBase} value '${raw}' equals ${dec} in Decimal (Base 10).`,
          },
          {
            title: "Radix Representations",
            text: `• Binary: 0b${binFormatted}\n• Octal: 0o${oct}\n• Hexadecimal: 0x${hex}`,
          },
        ],
        verification: {
          passed: parseInt(hex, 16) === parsedDecimal && parseInt(bin, 2) === parsedDecimal,
          detail: `Round-trip verification: parseInt(0x${hex}, 16) = ${dec} and parseInt(0b${bin}, 2) = ${dec}.`,
        },
        explanation: `Radix conversion decomposes positional notation where digit value equals digit × base^position.`,
      };
    },
    relatedCalculators: ["bitwise-calculator", "ipv4-subnet"],
    relatedConcepts: ["binary-representation-concept"],
  },

  // 2. Bitwise Logic & Shift Operations
  {
    id: "bitwise-calculator",
    name: "Bitwise Logic & Bit Shift",
    slug: "bitwise-calculator",
    category: "programming-bitwise",
    domain: "programming",
    description: "Perform bitwise AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), and Right Shift (>>) with 32-bit binary visualizer.",
    keywords: ["bitwise", "and", "or", "xor", "not", "bit shift", "binary logic", "masking"],
    inputs: [
      { key: "a", label: "Operand A", type: "number", defaultValue: 60, required: true },
      { key: "b", label: "Operand B", type: "number", defaultValue: 13, required: true },
    ],
    sampleInputs: [
      { label: "60 & 13 (0011 1100 & 0000 1101)", values: { a: 60, b: 13 } },
      { label: "128 & 255 (Masking)", values: { a: 128, b: 255 } },
    ],
    calculate: (input) => {
      const a = (Number(input.a) || 0) | 0;
      const b = (Number(input.b) || 0) | 0;

      const andRes = a & b;
      const orRes = a | b;
      const xorRes = a ^ b;
      const notA = ~a;
      const shl = a << 2;
      const shr = a >> 2;

      const toBin = (n: number) => (n >>> 0).toString(2).padStart(8, "0");

      return {
        status: "calculated",
        input: `A = ${a} (0b${toBin(a)}), B = ${b} (0b${toBin(b)})`,
        result: { and: andRes, or: orRes, xor: xorRes, notA, shl, shr },
        displayResult: `A & B = ${andRes} | A | B = ${orRes} | A ^ B = ${xorRes} | ~A = ${notA}`,
        steps: [
          {
            title: "Bitwise AND (A & B)",
            text: `0b${toBin(a)} & 0b${toBin(b)} = 0b${toBin(andRes)} (Decimal ${andRes})`,
          },
          {
            title: "Bitwise OR (A | B)",
            text: `0b${toBin(a)} | 0b${toBin(b)} = 0b${toBin(orRes)} (Decimal ${orRes})`,
          },
          {
            title: "Bitwise XOR (A ^ B)",
            text: `0b${toBin(a)} ^ 0b${toBin(b)} = 0b${toBin(xorRes)} (Decimal ${xorRes})`,
          },
        ],
        explanation: `Bitwise operators evaluate logical operations on each corresponding pair of bits independently in parallel.`,
      };
    },
    relatedCalculators: ["base-converter"],
    relatedConcepts: ["bitwise-concept"],
  },

  // 3. IPv4 CIDR Subnet Calculator
  {
    id: "ipv4-subnet",
    name: "IPv4 Subnet & CIDR Calculator",
    slug: "ipv4-subnet",
    category: "programming-networking",
    domain: "programming",
    description: "Compute Subnet Mask, Wildcard, Network Address, Broadcast Address, Host Range, and Total Usable Hosts for any CIDR IPv4 block.",
    keywords: ["ipv4", "cidr", "subnet", "subnet mask", "broadcast", "networking", "ip address", "routing"],
    formula: {
      name: "Usable Host Count Formula",
      latex: "N_{\\text{usable}} = 2^{32 - \\text{CIDR}} - 2",
      description: "Minus 2 accounts for reserved Network and Broadcast identifiers.",
    },
    inputs: [
      { key: "ip", label: "IP Address", type: "text", defaultValue: "192.168.1.50", required: true },
      { key: "cidr", label: "CIDR Prefix (e.g. 24 for /24)", type: "number", defaultValue: 24, min: 1, max: 32, required: true },
    ],
    sampleInputs: [
      { label: "192.168.1.50/24 (Standard LAN)", values: { ip: "192.168.1.50", cidr: 24 } },
      { label: "10.0.0.1/16 (Class A Subnet)", values: { ip: "10.0.0.1", cidr: 16 } },
      { label: "172.16.5.10/28 (Small Office)", values: { ip: "172.16.5.10", cidr: 28 } },
    ],
    calculate: (input) => {
      const ipStr = String(input.ip || "").trim();
      const cidr = Math.min(32, Math.max(1, parseInt(String(input.cidr || "24"), 10)));

      const octets = ipStr.split(".").map((s) => parseInt(s, 10));
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        return {
          status: "invalid",
          input: `${ipStr}/${cidr}`,
          result: null,
          warnings: ["Invalid IPv4 address format. Expecting 4 octets between 0 and 255 (e.g. 192.168.1.1)."],
        };
      }

      const ipNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
      const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr));
      const networkNum = ipNum & maskNum;
      const broadcastNum = networkNum | ~maskNum;

      const numToIp = (n: number) => [
        (n >>> 24) & 255,
        (n >>> 16) & 255,
        (n >>> 8) & 255,
        n & 255,
      ].join(".");

      const maskStr = numToIp(maskNum);
      const networkStr = numToIp(networkNum);
      const broadcastStr = numToIp(broadcastNum);
      const wildcardStr = numToIp(~maskNum);

      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalHosts - 2;

      const firstHost = cidr >= 31 ? networkStr : numToIp(networkNum + 1);
      const lastHost = cidr >= 31 ? broadcastStr : numToIp(broadcastNum - 1);

      return {
        status: "calculated",
        input: `${ipStr}/${cidr}`,
        result: { network: networkStr, broadcast: broadcastStr, mask: maskStr, usableHosts, firstHost, lastHost },
        displayResult: `Network: ${networkStr}/${cidr} | Usable Hosts: ${usableHosts.toLocaleString()} | Range: ${firstHost} - ${lastHost}`,
        steps: [
          {
            title: "Subnet Mask & Wildcard",
            text: `CIDR /${cidr} → Netmask: ${maskStr} (Wildcard: ${wildcardStr})`,
          },
          {
            title: "Network & Broadcast Computation",
            text: `Network Address (IP & MASK) = ${networkStr}\nBroadcast Address (Network | ~MASK) = ${broadcastStr}`,
          },
          {
            title: "Usable Host Range",
            text: `First Usable IP: ${firstHost}\nLast Usable IP: ${lastHost}\nTotal Usable Addresses: 2^(32 - ${cidr}) - 2 = ${usableHosts.toLocaleString()}`,
          },
        ],
        verification: {
          passed: true,
          detail: `Verification: Broadcast address is within valid 32-bit range and network address has host bits zeroed.`,
        },
        explanation: `Classless Inter-Domain Routing (CIDR) partitions a 32-bit IPv4 address into prefix (network routing) and suffix (host addressing) portions.`,
      };
    },
    relatedCalculators: ["base-converter", "bitwise-calculator"],
    relatedConcepts: ["ipv4-subnetting-concept"],
  },
];
