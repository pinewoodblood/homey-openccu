# Diagnostic capability migration

Homey does not reliably apply per-instance title overrides to capabilities that
were added dynamically after pairing. The previous `alarm_generic.*` and
`measure_voltage.operating` instances therefore rendered as repeated generic
labels in the device UI.

The enhanced fork exposes the same CCU datapoints through dedicated custom
capabilities with stable translated titles. Runtime reconciliation removes the
old generic capability instances and adds the new custom capabilities when the
app starts. Physical device addresses, Homey device IDs and primary control
capabilities remain unchanged.

The migration affects only the diagnostic capabilities introduced by this
fork. Any Flow created against those short-lived `alarm_generic.*` instances
must be recreated after updating. Dedicated diagnostic Flow cards can be added
in a later change after the hardware UI migration has been verified.
