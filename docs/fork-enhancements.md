# OpenCCU Local Enhanced fork

This fork keeps the upstream OpenCCU Local architecture but adds three focused
enhancement areas based on live CCU3 diagnostics:

1. A shared HmIP maintenance layer for safe, discovered channel-0 values such
   as operating voltage, RSSI, sabotage, unreachable/config/update state and
   common device faults.
2. Extended HmIP-ASIR/ASIR-O support with separate acoustic/optical active
   states plus configurable siren Flow actions. Values are validated against
   the actual CCU datapoint metadata before writes.
3. PSM/power-meter diagnostics including grid frequency, energy-counter
   overflow and measurement quality alarms.

The Homey app id is deliberately different from upstream:
`io.github.pinewoodblood.openccu`, so the fork can be installed alongside the
official Test app for controlled comparison.

The implementation remains discovery-driven: a diagnostic capability is only
added when the real device exposes the corresponding datapoint.
