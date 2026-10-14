import { describe, expect, it } from "vitest";

import {
  diagnosticCapabilityAlias,
  diagnosticCapabilityTargets,
  presentDiagnosticBindings,
} from "../../src/mapping/diagnostic-capabilities";
import type { CapabilityBinding } from "../../src/mapping/types";

const binding: CapabilityBinding = {
  capability: "alarm_generic.unreachable",
  channelAddress: "DEVICE:0",
  parameter: "UNREACH",
  readable: true,
  writable: false,
  transform: "boolean",
};

describe("diagnostic capability presentation", () => {
  it("maps generic system instances to capabilities with stable titles", () => {
    expect(diagnosticCapabilityAlias("alarm_generic.unreachable")).toBe(
      "homematic_unreachable",
    );
    expect(diagnosticCapabilityAlias("measure_voltage.operating")).toBe(
      "homematic_operating_voltage",
    );
  });

  it("preserves binding semantics while changing only the capability id", () => {
    expect(presentDiagnosticBindings([binding])).toEqual([
      { ...binding, capability: "homematic_unreachable" },
    ]);
  });

  it("uses unique non-generic target ids", () => {
    const targets = diagnosticCapabilityTargets();
    expect(new Set(targets).size).toBe(targets.length);
    expect(targets).toHaveLength(15);
    expect(targets.every((id) => id.startsWith("homematic_"))).toBe(true);
  });
});
