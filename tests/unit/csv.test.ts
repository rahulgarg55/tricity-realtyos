import { describe, it, expect } from "vitest";
import { sanitizeCsvField, generateCsvString, parseAndValidateLeadCsv } from "@/lib/csv";

describe("CSV Import & Export Security Tests", () => {
  it("should escape formula injection characters by prepending single quote", () => {
    // Formula injection payload
    expect(sanitizeCsvField("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvField("+1000")).toBe("'+1000");
    expect(sanitizeCsvField("-cmd|' /C calc'!A0")).toBe("'-cmd|' /C calc'!A0");
    // With comma, should prepend quote AND wrap in quotes
    expect(sanitizeCsvField("@SUM(1,2)")).toBe('"\'@SUM(1,2)"');
    expect(sanitizeCsvField("Safe Text")).toBe("Safe Text");
  });

  it("should escape quotes and wrap cells with commas properly", () => {
    expect(sanitizeCsvField('Hero Homes, "Mohali"')).toBe('"Hero Homes, ""Mohali"""');
  });

  it("should parse valid leads, normalize phone numbers and reject duplicates", () => {
    const csvContent = `Name,Mobile,Location,Budget,Type
Jaswinder Singh,9814011223,Mohali Sector 82,8500000,3BHK
Gurpreet Kaur,9815022334,Zirakpur PR7,6500000,2BHK
Duplicate User,9814011223,Mohali,5000000,2BHK
Invalid Phone User,1234,Chandigarh,10000000,4BHK`;

    const existingPhones = new Set<string>(["+919815022334"]); // Gurpreet already in DB

    const result = parseAndValidateLeadCsv(csvContent, existingPhones);

    // Jaswinder is valid
    expect(result.validLeads.length).toBe(1);
    expect(result.validLeads[0].name).toBe("Jaswinder Singh");
    expect(result.validLeads[0].phone).toBe("+919814011223");

    // Gurpreet was existing duplicate, Duplicate User was in-batch duplicate
    expect(result.duplicates.length).toBe(2);

    // Invalid Phone User has invalid phone number
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].reason).toContain("Invalid phone number");
  });
});
