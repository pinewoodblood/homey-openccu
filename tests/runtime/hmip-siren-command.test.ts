import { describe, expect, it } from "vitest";
import {
  parseHmIpSirenAlarmCommand,
  STOP_HMIP_SIREN_ALARM,
} from "../../src/runtime/hmip-siren";

describe("HmIP siren command", () => {
  it("parses a valid ASIR-O command", () => {
    expect(
      parseHmIpSirenAlarmCommand({
        acoustic: "FREQUENCY_RISING_AND_FALLING",
        optical: "BLINKING_ALTERNATELY_REPEATING",
        duration: 30,
        unit: "S",
      }),
    ).toEqual({
      acoustic: "FREQUENCY_RISING_AND_FALLING",
      optical: "BLINKING_ALTERNATELY_REPEATING",
      durationValue: 30,
      durationUnit: "S",
    });
  });

  it("rejects invalid duration or signal values", () => {
    expect(() =>
      parseHmIpSirenAlarmCommand({
        acoustic: "NOT_A_SIGNAL",
        optical: "DISABLE_OPTICAL_SIGNAL",
        duration: 1,
        unit: "S",
      }),
    ).toThrow();
    expect(() =>
      parseHmIpSirenAlarmCommand({
        acoustic: "DISABLE_ACOUSTIC_SIGNAL",
        optical: "DISABLE_OPTICAL_SIGNAL",
        duration: 20000,
        unit: "S",
      }),
    ).toThrow();
  });

  it("provides an explicit stop command", () => {
    expect(STOP_HMIP_SIREN_ALARM).toEqual({
      acoustic: "DISABLE_ACOUSTIC_SIGNAL",
      optical: "DISABLE_OPTICAL_SIGNAL",
      durationValue: 0,
      durationUnit: "S",
    });
  });
});
