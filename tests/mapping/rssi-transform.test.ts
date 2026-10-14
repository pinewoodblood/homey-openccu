import { describe, expect, it } from "vitest";
import { transformFromOpenCcu } from "../../src/mapping/transforms";

describe("Homematic RSSI normalization", () => {
  it.each([
    [-68, -68],
    [68, -68],
    [196, -60],
    [-196, -60],
    [0, null],
    [1, null],
    [127, null],
    [-128, null],
  ])("maps %s to %s", (input, expected) => {
    expect(transformFromOpenCcu("rssi-dbm", input)).toBe(expected);
  });
});

describe("status alarms", () => {
  it("treats NORMAL as healthy and other enum states as alarms", () => {
    expect(
      transformFromOpenCcu("normal-status-to-alarm", "NORMAL"),
    ).toBe(false);
    expect(
      transformFromOpenCcu("normal-status-to-alarm", "UNKNOWN"),
    ).toBe(true);
    expect(
      transformFromOpenCcu("normal-status-to-alarm", "OVERFLOW"),
    ).toBe(true);
  });
});
