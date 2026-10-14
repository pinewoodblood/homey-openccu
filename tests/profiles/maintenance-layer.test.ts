import { describe, expect, it } from "vitest";
import type { OpenCcuDataPoint, OpenCcuDevice } from "../../src/domain/model";
import { resolveDeviceMapping } from "../../src/mapping/device-resolver";
import { resolveHmIpMaintenanceBindings } from "../../src/profiles/maintenance";
import type { ParameterType } from "../../src/protocol/xmlrpc/types";

function point(parameter: string, type: ParameterType): OpenCcuDataPoint {
  return {
    centralId: "ccu",
    interfaceId: "HmIP-RF",
    channelAddress: "DEVICE:0",
    parameter,
    metadata: { TYPE: type, OPERATIONS: 5, FLAGS: 1 },
    readable: true,
    writable: false,
    eventable: true,
  };
}

function device(): OpenCcuDevice {
  const points = [
    point("LOW_BAT", "BOOL"),
    point("OPERATING_VOLTAGE", "FLOAT"),
    point("OPERATING_VOLTAGE_STATUS", "ENUM"),
    point("RSSI_DEVICE", "INTEGER"),
    point("RSSI_PEER", "INTEGER"),
    point("SABOTAGE", "BOOL"),
    point("UNREACH", "BOOL"),
    point("CONFIG_PENDING", "BOOL"),
    point("UPDATE_PENDING", "BOOL"),
    point("DUTY_CYCLE", "BOOL"),
    point("ERROR_OVERHEAT", "BOOL"),
  ];
  return {
    address: "DEVICE",
    type: "HmIP-SWDO-PL-2",
    availability: "available",
    updatable: false,
    channels: new Map([
      [
        "DEVICE:0",
        {
          address: "DEVICE:0",
          type: "MAINTENANCE",
          index: 0,
          paramsets: ["VALUES"],
          dataPoints: new Map(points.map((p) => [p.parameter, p])),
        },
      ],
    ]),
  };
}

describe("HmIP maintenance layer", () => {
  it("maps safe discovered maintenance datapoints only", () => {
    const capabilities = resolveHmIpMaintenanceBindings(device()).map(
      ({ capability }) => capability,
    );
    expect(capabilities).toContain("alarm_battery");
    expect(capabilities).toContain("measure_voltage.operating");
    expect(capabilities).toContain("homematic_rssi_device");
    expect(capabilities).toContain("homematic_rssi_peer");
    expect(capabilities).toContain("alarm_tamper");
    expect(capabilities).toContain("alarm_generic.unreachable");
    expect(capabilities).toContain("alarm_generic.overheat");
    expect(capabilities).not.toContain("INSTALL_TEST");
  });

  it("keeps pairing minimal and adds maintenance during runtime reconciliation", () => {
    const pairingCapabilities = resolveDeviceMapping(device()).bindings.map(
      ({ capability }) => capability,
    );
    const runtimeCapabilities = resolveDeviceMapping(
      device(),
      undefined,
      undefined,
      false,
      true,
    ).bindings.map(({ capability }) => capability);

    expect(pairingCapabilities).not.toContain("homematic_rssi_device");
    expect(runtimeCapabilities).toContain("homematic_rssi_device");
    expect(runtimeCapabilities).toContain("alarm_generic.unreachable");
  });

  it("does not add the shared layer to an unverified device family", () => {
    const unverified = { ...device(), type: "HmIP-UNVERIFIED" };
    expect(resolveHmIpMaintenanceBindings(unverified)).toEqual([]);
  });
});
