import { describe, expect, it } from "vitest";

import {
  capabilityPresentationIds,
  capabilityPresentationOptions,
} from "../../src/homey/capability-presentation";

describe("dynamic capability presentation", () => {
  it("gives every generic diagnostic alarm a distinct localized title", () => {
    const alarmIds = capabilityPresentationIds().filter((id) =>
      id.startsWith("alarm_generic."),
    );
    const germanTitles = alarmIds.map(
      (id) => capabilityPresentationOptions(id)!.title.de,
    );
    const englishTitles = alarmIds.map(
      (id) => capabilityPresentationOptions(id)!.title.en,
    );

    expect(alarmIds).toHaveLength(14);
    expect(new Set(germanTitles).size).toBe(alarmIds.length);
    expect(new Set(englishTitles).size).toBe(alarmIds.length);
    expect(germanTitles).not.toContain("Allgemeiner Alarm");
  });

  it.each([
    ["alarm_generic.unreachable", "Nicht erreichbar"],
    ["alarm_generic.overheat", "Übertemperatur"],
    ["alarm_generic.overload", "Überlast"],
    ["alarm_generic.power_failure", "Stromausfall"],
    ["alarm_generic.frequency_status", "Frequenzmessfehler"],
    ["measure_voltage.operating", "Betriebsspannung"],
  ])("maps %s to the German title %s", (capability, title) => {
    expect(capabilityPresentationOptions(capability)?.title.de).toBe(title);
  });

  it("leaves unrelated capabilities unchanged", () => {
    expect(capabilityPresentationOptions("alarm_generic.other")).toBeUndefined();
    expect(capabilityPresentationOptions("measure_power")).toBeUndefined();
  });
});
