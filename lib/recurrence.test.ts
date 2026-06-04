import { describe, expect, it } from "bun:test";
import { isDueOn } from "./recurrence";

// 2026-06-05 is a Friday; 2026-06-06 is a Saturday.
const friday = new Date("2026-06-05T12:00:00");
const saturday = new Date("2026-06-06T12:00:00");

describe("isDueOn", () => {
  it("DAILY is always due", () => {
    expect(isDueOn("DAILY", friday)).toBe(true);
    expect(isDueOn("DAILY", saturday)).toBe(true);
  });
  it("NONE is never due", () => {
    expect(isDueOn("NONE", friday)).toBe(false);
  });
  it("WEEKDAYS is due Mon-Fri only", () => {
    expect(isDueOn("WEEKDAYS", friday)).toBe(true);
    expect(isDueOn("WEEKDAYS", saturday)).toBe(false);
  });
  it("WEEKENDS is due Sat/Sun only", () => {
    expect(isDueOn("WEEKENDS", friday)).toBe(false);
    expect(isDueOn("WEEKENDS", saturday)).toBe(true);
  });
  it("specific weekday matches", () => {
    expect(isDueOn("FRIDAY", friday)).toBe(true);
    expect(isDueOn("SATURDAY", friday)).toBe(false);
  });
});
