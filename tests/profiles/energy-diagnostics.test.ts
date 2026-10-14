import { describe, expect, it } from "vitest";
import type { OpenCcuDataPoint, OpenCcuDevice } from "../../src/domain/model";
import { ProfileRegistry } from "../../src/profiles/registry";
import type { ParameterType } from "../../src/protocol/xmlrpc/types";

function point(parameter: string, type: ParameterType): OpenCcuDataPoint {
  return {
    centralId: "ccu",
    interfaceId: "HmIP-RF",
    channelAddress: "PSM:6",
    parameter,
    metadata: { TYPE: type, OPERATIONS: 5, FLAGS: 1 },
    readable: true,
    writable: false,
    eventable: true,
  };
}

describe("PSM energy diagnostics", () => {
  it("exposes frequency and quality/overflow alarms when discovered", () => {
    const points = [
      point("FREQUENCY", "FLOAT"),
      point("FREQUENCY_STATUS", "ENUM"),
      point("ENERGY_COUNTER_OVERFLOW", "BOOL"),
    ];
    const device: OpenCcuDevice = {
      address: "PSM",
      type: "HmIP-PSM-2",
      availability: "available",
      updatable: false,
      channels: new Map([
        [
          "PSM:6",
          {
            address: "PSM:6",
            type: "ENERGIE_METER_TRANSMITTER",
            index: 6,
            paramsets: ["VALUES"],
            dataPoints: new Map(points.map((p) => [p.parameter, p])),
          },
        ],
      ]),
    };

    const capabilities = new ProfileRegistry()
      .resolve(device)
      .map(({ capability }) => capability);
    expect(capabilities).toContain("measure_frequency");
    expect(capabilities).toContain("alarm_generic.frequency_status");
    expect(capabilities).toContain("alarm_generic.energy_counter_overflow");
  });
});
