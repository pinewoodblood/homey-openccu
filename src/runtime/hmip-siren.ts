export const HMIP_ACOUSTIC_ALARM_SELECTIONS = [
  "DISABLE_ACOUSTIC_SIGNAL",
  "FREQUENCY_RISING",
  "FREQUENCY_FALLING",
  "FREQUENCY_RISING_AND_FALLING",
  "FREQUENCY_ALTERNATING_LOW_HIGH",
  "FREQUENCY_ALTERNATING_LOW_MID_HIGH",
  "FREQUENCY_HIGHON_OFF",
  "FREQUENCY_HIGHON_LONGOFF",
  "FREQUENCY_LOWON_OFF_HIGHON_OFF",
  "FREQUENCY_LOWON_LONGOFF_HIGHON_LONGOFF",
  "LOW_BATTERY",
  "DISARMED",
  "INTERNALLY_ARMED",
  "EXTERNALLY_ARMED",
  "DELAYED_INTERNALLY_ARMED",
  "DELAYED_EXTERNALLY_ARMED",
  "EVENT",
  "ERROR",
] as const;

export const HMIP_OPTICAL_ALARM_SELECTIONS = [
  "DISABLE_OPTICAL_SIGNAL",
  "BLINKING_ALTERNATELY_REPEATING",
  "BLINKING_BOTH_REPEATING",
  "DOUBLE_FLASHING_REPEATING",
  "FLASHING_BOTH_REPEATING",
  "CONFIRMATION_SIGNAL_0",
  "CONFIRMATION_SIGNAL_1",
  "CONFIRMATION_SIGNAL_2",
] as const;

export const HMIP_ALARM_DURATION_UNITS = ["S", "M", "H"] as const;

export interface HmIpSirenAlarmCommand {
  readonly acoustic: (typeof HMIP_ACOUSTIC_ALARM_SELECTIONS)[number];
  readonly optical: (typeof HMIP_OPTICAL_ALARM_SELECTIONS)[number];
  readonly durationUnit: (typeof HMIP_ALARM_DURATION_UNITS)[number];
  readonly durationValue: number;
}

export function parseHmIpSirenAlarmCommand(
  value: Readonly<Record<string, unknown>>,
): HmIpSirenAlarmCommand {
  const acoustic = value.acoustic;
  const optical = value.optical;
  const durationUnit = value.durationUnit ?? value.unit;
  const durationValue = value.durationValue ?? value.duration;
  if (
    typeof acoustic !== "string" ||
    !HMIP_ACOUSTIC_ALARM_SELECTIONS.includes(
      acoustic as HmIpSirenAlarmCommand["acoustic"],
    )
  )
    throw new TypeError("Invalid acoustic alarm selection");
  if (
    typeof optical !== "string" ||
    !HMIP_OPTICAL_ALARM_SELECTIONS.includes(
      optical as HmIpSirenAlarmCommand["optical"],
    )
  )
    throw new TypeError("Invalid optical alarm selection");
  if (
    typeof durationUnit !== "string" ||
    !HMIP_ALARM_DURATION_UNITS.includes(
      durationUnit as HmIpSirenAlarmCommand["durationUnit"],
    )
  )
    throw new TypeError("Invalid alarm duration unit");
  if (
    typeof durationValue !== "number" ||
    !Number.isInteger(durationValue) ||
    durationValue < 0 ||
    durationValue > 16_343
  )
    throw new TypeError("Invalid alarm duration");
  return {
    acoustic: acoustic as HmIpSirenAlarmCommand["acoustic"],
    optical: optical as HmIpSirenAlarmCommand["optical"],
    durationUnit: durationUnit as HmIpSirenAlarmCommand["durationUnit"],
    durationValue,
  };
}

export const STOP_HMIP_SIREN_ALARM: HmIpSirenAlarmCommand = {
  acoustic: "DISABLE_ACOUSTIC_SIGNAL",
  optical: "DISABLE_OPTICAL_SIGNAL",
  durationUnit: "S",
  durationValue: 0,
};
