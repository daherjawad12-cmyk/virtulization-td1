// tests/sysinfo.spec.ts
import { getSystemInformation } from "../src/index";

// on mock le module systeminformation
jest.mock("systeminformation", () => ({
  cpu: jest.fn().mockResolvedValue({ manufacturer: "mocked", brand: "cpu" }),
  system: jest.fn().mockResolvedValue({ model: "mocked-system" }),
  mem: jest.fn().mockResolvedValue({ total: 1000, free: 500 }),
  osInfo: jest.fn().mockResolvedValue({ platform: "linux" }),
  currentLoad: jest.fn().mockResolvedValue({ currentload: 12.5 }),
  processes: jest.fn().mockResolvedValue({ all: 42 }),
  diskLayout: jest.fn().mockResolvedValue([{ name: "sda" }]),
  networkInterfaces: jest.fn().mockResolvedValue([{ iface: "eth0" }]),
}));

describe("getSystemInformation", () => {
  it("should return an object with all required fields", async () => {
    const info = await getSystemInformation();

    expect(info).toHaveProperty("cpu");
    expect(info).toHaveProperty("system");
    expect(info).toHaveProperty("mem");
    expect(info).toHaveProperty("os");
    expect(info).toHaveProperty("currentLoad");
    expect(info).toHaveProperty("processes");
    expect(info).toHaveProperty("diskLayout");
    expect(info).toHaveProperty("networkInterfaces");
  });

  it("should map data from systeminformation correctly", async () => {
    const info = await getSystemInformation();
    expect(info.cpu.brand).toBe("cpu");
    expect(info.os.platform).toBe("linux");
    expect(Array.isArray(info.diskLayout)).toBe(true);
  });
});
