import type { CapabilityBinding } from "./types";

const DIAGNOSTIC_CAPABILITY_ALIASES: Readonly<Record<string, string>> = {
  "measure_voltage.operating": "homematic_operating_voltage",
  "alarm_generic.energy_counter_overflow":
    "homematic_energy_counter_overflow",
  "alarm_generic.current_status": "homematic_current_measurement_error",
  "alarm_generic.power_status": "homematic_power_measurement_error",
  "alarm_generic.voltage_status": "homematic_voltage_measurement_error",
  "alarm_generic.frequency_status": "homematic_frequency_measurement_error",
  "alarm_generic.unreachable": "homematic_unreachable",
  "alarm_generic.sticky_unreachable": "homematic_sticky_unreachable",
  "alarm_generic.config_pending": "homematic_config_pending",
  "alarm_generic.update_pending": "homematic_update_pending",
  "alarm_generic.duty_cycle": "homematic_duty_cycle_warning",
  "alarm_generic.overheat": "homematic_overheat",
  "alarm_generic.overload": "homematic_overload",
  "alarm_generic.power_failure": "homematic_power_failure",
  "alarm_generic.rechargeable_battery_health":
    "homematic_rechargeable_battery_health_error",
};

export function presentDiagnosticBindings(
  bindings: readonly CapabilityBinding[],
): readonly CapabilityBinding[] {
  return bindings.map((binding) => {
    const capability = DIAGNOSTIC_CAPABILITY_ALIASES[binding.capability];
    return capability === undefined ? binding : { ...binding, capability };
  });
}

export function diagnosticCapabilityAlias(
  capability: string,
): string | undefined {
  return DIAGNOSTIC_CAPABILITY_ALIASES[capability];
}

export function diagnosticCapabilityTargets(): readonly string[] {
  return Object.values(DIAGNOSTIC_CAPABILITY_ALIASES);
}
