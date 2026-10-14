import type { OpenCcuDevice } from "../domain/model";
import type { CapabilityBinding, ValueTransform } from "../mapping/types";
import type { ParameterType } from "../protocol/xmlrpc/types";

interface MaintenanceDefinition {
  readonly capability: string;
  readonly parameters: readonly string[];
  readonly types: readonly ParameterType[];
  readonly transform?: ValueTransform;
}

const MAINTENANCE: readonly MaintenanceDefinition[] = [
  {
    capability: "alarm_battery",
    parameters: ["LOW_BAT", "LOWBAT"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "measure_voltage.operating",
    parameters: ["OPERATING_VOLTAGE"],
    types: ["FLOAT", "INTEGER"],
  },
  {
    capability: "homematic_rssi_device",
    parameters: ["RSSI_DEVICE"],
    types: ["INTEGER"],
    transform: "rssi-dbm",
  },
  {
    capability: "homematic_rssi_peer",
    parameters: ["RSSI_PEER"],
    types: ["INTEGER"],
    transform: "rssi-dbm",
  },
  {
    capability: "alarm_tamper",
    parameters: ["SABOTAGE"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.unreachable",
    parameters: ["UNREACH"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.sticky_unreachable",
    parameters: ["STICKY_UNREACH"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.config_pending",
    parameters: ["CONFIG_PENDING"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.update_pending",
    parameters: ["UPDATE_PENDING"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.duty_cycle",
    parameters: ["DUTY_CYCLE", "DUTYCYCLE"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.overheat",
    parameters: ["ERROR_OVERHEAT"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.overload",
    parameters: ["ERROR_OVERLOAD"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.power_failure",
    parameters: ["ERROR_POWER_FAILURE"],
    types: ["BOOL"],
    transform: "boolean",
  },
  {
    capability: "alarm_generic.rechargeable_battery_health",
    parameters: ["ERROR_BAD_RECHARGEABLE_BATTERY_HEALTH"],
    types: ["BOOL"],
    transform: "boolean",
  },
];

export function resolveHmIpMaintenanceBindings(
  device: OpenCcuDevice,
): readonly CapabilityBinding[] {
  const channel = [...device.channels.values()].find(
    (candidate) => candidate.index === 0 && candidate.type === "MAINTENANCE",
  );
  if (channel === undefined) return [];
  const interfaceId = channel.dataPoints.values().next().value?.interfaceId;
  if (interfaceId !== "HmIP-RF") return [];

  return MAINTENANCE.flatMap((definition) => {
    const parameter = definition.parameters.find((candidate) => {
      const point = channel.dataPoints.get(candidate);
      return (
        point !== undefined &&
        point.readable &&
        definition.types.includes(point.metadata.TYPE)
      );
    });
    if (parameter === undefined) return [];
    return [
      {
        capability: definition.capability,
        channelAddress: channel.address,
        parameter,
        readable: true,
        writable: false,
        transform: definition.transform ?? "identity",
      },
    ];
  });
}

export function mergeCapabilityBindings(
  primary: readonly CapabilityBinding[],
  secondary: readonly CapabilityBinding[],
): readonly CapabilityBinding[] {
  const claimed = new Set(primary.map(({ capability }) => capability));
  return [
    ...primary,
    ...secondary.filter(({ capability }) => !claimed.has(capability)),
  ];
}
