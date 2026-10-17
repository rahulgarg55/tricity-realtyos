import { describe, it, expect } from "vitest";
import { normalizePhoneNumber, isValidIndianMobile, formatIndianPhoneDisplay } from "@/lib/phone";

describe("Tricity Real Estate Phone Utility Tests", () => {
  it("should normalize 10-digit Indian mobile numbers by adding +91", () => {
    expect(normalizePhoneNumber("9814012345")).toBe("+919814012345");
    expect(normalizePhoneNumber("98150 99887")).toBe("+919815099887");
    expect(normalizePhoneNumber("98765-43210")).toBe("+919876543210");
  });

  it("should normalize numbers starting with leading 0", () => {
    expect(normalizePhoneNumber("09814012345")).toBe("+919814012345");
  });

  it("should normalize numbers starting with 91 or +91", () => {
    expect(normalizePhoneNumber("919814012345")).toBe("+919814012345");
    expect(normalizePhoneNumber("+919814012345")).toBe("+919814012345");
  });

  it("should validate legitimate Indian mobile numbers", () => {
    expect(isValidIndianMobile("9814012345")).toBe(true);
    expect(isValidIndianMobile("+919815099887")).toBe(true);
    expect(isValidIndianMobile("12345")).toBe(false); // too short
    expect(isValidIndianMobile("4514012345")).toBe(false); // does not start with 6-9
  });

  it("should format display phone number with spaces", () => {
    expect(formatIndianPhoneDisplay("+919814012345")).toBe("+91 98140 12345");
  });
});
