// tests/api.spec.ts
import request from "supertest";
import { app } from "../src/index";

// on peut mocker systeminformation ici aussi pour avoir un JSON prévisible
jest.mock("systeminformation", () => ({
  cpu: jest.fn().mockResolvedValue({ brand: "test-cpu" }),
  system: jest.fn().mockResolvedValue({ model: "test-system" }),
  mem: jest.fn().mockResolvedValue({ total: 2048, free: 1024 }),
  osInfo: jest.fn().mockResolvedValue({ platform: "linux" }),
  currentLoad: jest.fn().mockResolvedValue({ currentload: 5 }),
  processes: jest.fn().mockResolvedValue({ all: 10 }),
  diskLayout: jest.fn().mockResolvedValue([{ name: "sda" }]),
  networkInterfaces: jest.fn().mockResolvedValue([{ iface: "eth0" }]),
}));

describe("API /api/v1/sysinfo", () => {
  it("should return 200 and a JSON body with system info", async () => {
    const res = await request(app).get("/api/v1/sysinfo");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("cpu");
    expect(res.body).toHaveProperty("mem");
    expect(res.body.cpu.brand).toBe("test-cpu");
  });

  it("should return 404 on unknown route", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "not found" });
  });
});
