export interface CapabilityPresentationOptions {
  readonly title: {
    readonly en: string;
    readonly de: string;
  };
}

const CAPABILITY_PRESENTATION: Readonly<
  Record<string, CapabilityPresentationOptions>
> = {
  "measure_voltage.operating": {
    title: { en: "Operating voltage", de: "Betriebsspannung" },
  },
  "alarm_generic.energy_counter_overflow": {
    title: { en: "Energy counter overflow", de: "Zählerüberlauf" },
  },
  "alarm_generic.current_status": {
    title: { en: "Current measurement fault", de: "Strommessfehler" },
  },
  "alarm_generic.power_status": {
    title: { en: "Power measurement fault", de: "Leistungsmessfehler" },
  },
  "alarm_generic.voltage_status": {
    title: { en: "Voltage measurement fault", de: "Spannungsmessfehler" },
  },
  "alarm_generic.frequency_status": {
    title: { en: "Frequency measurement fault", de: "Frequenzmessfehler" },
  },
  "alarm_generic.unreachable": {
    title: { en: "Device unreachable", de: "Nicht erreichbar" },
  },
  "alarm_generic.sticky_unreachable": {
    title: { en: "Repeatedly unreachable", de: "Wiederholt unerreichbar" },
  },
  "alarm_generic.config_pending": {
    title: { en: "Configuration pending", de: "Konfiguration offen" },
  },
  "alarm_generic.update_pending": {
    title: { en: "Update pending", de: "Update ausstehend" },
  },
  "alarm_generic.duty_cycle": {
    title: { en: "Duty cycle warning", de: "Duty-Cycle-Warnung" },
  },
  "alarm_generic.overheat": {
    title: { en: "Overtemperature", de: "Übertemperatur" },
  },
  "alarm_generic.overload": {
    title: { en: "Overload", de: "Überlast" },
  },
  "alarm_generic.power_failure": {
    title: { en: "Power failure", de: "Stromausfall" },
  },
  "alarm_generic.rechargeable_battery_health": {
    title: { en: "Battery health fault", de: "Akkugesundheit" },
  },
};

export function capabilityPresentationOptions(
  capabilityId: string,
): CapabilityPresentationOptions | undefined {
  return CAPABILITY_PRESENTATION[capabilityId];
}

export function capabilityPresentationIds(): readonly string[] {
  return Object.keys(CAPABILITY_PRESENTATION);
}
