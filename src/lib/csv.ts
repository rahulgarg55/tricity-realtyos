import { normalizePhoneNumber } from "./phone";

/**
 * Escapes values to prevent CSV / Spreadsheet formula injection (CSV Injection OWASP).
 * If a value starts with =, +, -, @, tab, or carriage return, prepend a single quote '.
 */
export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);

  // If first character is sensitive formula initiator
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape quotes and wrap in quotes if contains comma, quote or newline
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function generateCsvString(headers: string[], rows: any[][]): string {
  const headerLine = headers.map(sanitizeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(sanitizeCsvField).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

export interface ParsedCsvLead {
  name: string;
  phone: string;
  email?: string;
  preferredLocation?: string;
  budgetMax?: number;
  propertyType?: string;
  leadSource?: string;
  notes?: string;
}

export interface CsvValidationResult {
  validLeads: ParsedCsvLead[];
  errors: { row: number; reason: string; raw: any }[];
  duplicates: { row: number; phone: string; name: string }[];
}

export function parseAndValidateLeadCsv(
  csvContent: string,
  existingPhones: Set<string>
): CsvValidationResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      validLeads: [],
      errors: [{ row: 1, reason: "CSV is empty or missing data rows", raw: "" }],
      duplicates: [],
    };
  }

  // Parse header
  const headerParts = parseCsvLine(lines[0]).map((h) => h.toLowerCase());

  // Find column indexes
  const nameIdx = headerParts.findIndex((h) => h.includes("name"));
  const phoneIdx = headerParts.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("contact"));
  const emailIdx = headerParts.findIndex((h) => h.includes("email"));
  const locIdx = headerParts.findIndex((h) => h.includes("location") || h.includes("area") || h.includes("city"));
  const budgetIdx = headerParts.findIndex((h) => h.includes("budget") || h.includes("price"));
  const typeIdx = headerParts.findIndex((h) => h.includes("type") || h.includes("unit") || h.includes("bhk"));
  const sourceIdx = headerParts.findIndex((h) => h.includes("source"));
  const notesIdx = headerParts.findIndex((h) => h.includes("note") || h.includes("comment"));

  if (phoneIdx === -1) {
    return {
      validLeads: [],
      errors: [{ row: 1, reason: "Missing required 'Phone' or 'Mobile' column header", raw: lines[0] }],
      duplicates: [],
    };
  }

  const validLeads: ParsedCsvLead[] = [];
  const errors: { row: number; reason: string; raw: any }[] = [];
  const duplicates: { row: number; phone: string; name: string }[] = [];
  const seenInBatch = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const rawLine = lines[i];

    const cols = parseCsvLine(rawLine);

    const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : "Enquiry Lead";
    const rawPhone = cols[phoneIdx] || "";
    const normalizedPhone = normalizePhoneNumber(rawPhone);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      errors.push({
        row: rowNum,
        reason: `Invalid phone number: '${rawPhone}'`,
        raw: rawLine,
      });
      continue;
    }

    if (existingPhones.has(normalizedPhone) || seenInBatch.has(normalizedPhone)) {
      duplicates.push({
        row: rowNum,
        phone: normalizedPhone,
        name,
      });
      continue;
    }

    seenInBatch.add(normalizedPhone);

    const email = emailIdx !== -1 ? cols[emailIdx] : undefined;
    const preferredLocation = locIdx !== -1 ? cols[locIdx] : "Mohali";
    const budgetRaw = budgetIdx !== -1 ? cols[budgetIdx].replace(/[^\d.]/g, "") : null;
    const budgetMax = budgetRaw ? parseFloat(budgetRaw) : undefined;
    const propertyType = typeIdx !== -1 ? cols[typeIdx] : "3BHK";
    const leadSource = sourceIdx !== -1 && cols[sourceIdx] ? cols[sourceIdx] : "CSV Import";
    const notes = notesIdx !== -1 ? cols[notesIdx] : undefined;

    validLeads.push({
      name,
      phone: normalizedPhone,
      email: email && email.includes("@") ? email : undefined,
      preferredLocation,
      budgetMax: budgetMax && !isNaN(budgetMax) ? budgetMax : undefined,
      propertyType,
      leadSource,
      notes,
    });
  }

  return { validLeads, errors, duplicates };
}
