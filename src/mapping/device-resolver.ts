import type { OpenCcuDevice } from "../domain/model";
import { MappingDecisionLog } from "./decision";
import { presentDiagnosticBindings } from "./diagnostic-capabilities";
import { mapGenericDevice } from "./generic-mapper";
import type { ButtonEventBinding, CapabilityBinding } from "./types";
import { ProfileRegistry } from "../profiles/registry";
import {
  mergeCapabilityBindings,
  resolveHmIpMaintenanceBindings,
} from "../profiles/maintenance";
import {
  resolveProfileButtonEvents,
  type DeviceProfile,
  type LogicalDeviceProfile,
} from "../profiles/types";

export const GENERIC_DRIVER_ID = "openccu-generic";

export interface ResolvedDeviceMapping {
  readonly driverId: string;
  readonly profileId?: string;
  readonly logicalId?: string;
  readonly nameSuffix?: string;
  readonly nameChannel?: number;
  readonly generic: boolean;
  readonly bindings: readonly CapabilityBinding[];
  readonly buttonEvents: readonly ButtonEventBinding[];
  readonly decisions: ReturnType<MappingDecisionLog["list"]>;
}

export function resolveDeviceMapping(
  device: OpenCcuDevice,
  profiles = new ProfileRegistry(),
  logicalId?: string,
  preserveLegacyGeneric = false,
  includeMaintenance = false,
): ResolvedDeviceMapping {
  const profile = profiles.find(device.type);
  // A previously paired generic parent has no logical-channel identity. Keep
  // its mapping until the user chooses the new per-output devices.
  if (
    preserveLegacyGeneric &&
    logicalId === undefined &&
    profile?.logicalDevices !== undefined
  ) {
    return resolveDeviceMapping(
      device,
      new ProfileRegistry([]),
      undefined,
      false,
      includeMaintenance,
    );
  }
  if (profile) {
    const logical = selectLogicalDevice(profile, logicalId);
    return resolveKnownDeviceMapping(
      device,
      profiles,
      profile,
      logical,
      includeMaintenance,
    );
  }
  if (logicalId !== undefined) {
    throw new Error(
      `Unknown device ${device.type} has no logical device ${logicalId}`,
    );
  }
  const decisions = new MappingDecisionLog();
  const genericBindings = mapGenericDevice(device, decisions);
  const bindings = includeMaintenance
    ? mergeCapabilityBindings(
        genericBindings,
        resolveHmIpMaintenanceBindings(device),
      )
    : genericBindings;
  return {
    driverId: GENERIC_DRIVER_ID,
    generic: true,
    bindings: presentDiagnosticBindings(bindings),
    buttonEvents: [],
    decisions: decisions.list(),
  };
}

export function resolveDeviceMappings(
  device: OpenCcuDevice,
  profiles = new ProfileRegistry(),
): readonly ResolvedDeviceMapping[] {
  const profile = profiles.find(device.type);
  if (profile?.logicalDevices !== undefined) {
    return profile.logicalDevices
      .map((logical) =>
        resolveKnownDeviceMapping(device, profiles, profile, logical, false),
      )
      .filter(
        ({ bindings, buttonEvents }) =>
          bindings.length > 0 || buttonEvents.length > 0,
      );
  }
  return [resolveDeviceMapping(device, profiles)];
}

function resolveKnownDeviceMapping(
  device: OpenCcuDevice,
  profiles: ProfileRegistry,
  profile: DeviceProfile,
  logical: LogicalDeviceProfile | undefined,
  includeMaintenance: boolean,
): ResolvedDeviceMapping {
  const decisions = new MappingDecisionLog();
  const definition = logical ?? profile;
  const profileBindings = profiles.resolve(device, decisions, logical?.id);
  const resolvedBindings =
    includeMaintenance && logical === undefined
      ? mergeCapabilityBindings(
          profileBindings,
          resolveHmIpMaintenanceBindings(device),
        )
      : profileBindings;
  return {
    driverId: profile.driverId,
    profileId: profile.id,
    ...(logical === undefined
      ? {}
      : {
          logicalId: logical.id,
          nameSuffix: logical.nameSuffix,
          ...(logical.nameChannel === undefined
            ? {}
            : { nameChannel: logical.nameChannel }),
        }),
    generic: false,
    bindings: presentDiagnosticBindings(resolvedBindings),
    buttonEvents: resolveProfileButtonEvents(device, definition),
    decisions: decisions.list(),
  };
}

function selectLogicalDevice(
  profile: DeviceProfile,
  logicalId: string | undefined,
): LogicalDeviceProfile | undefined {
  if (profile.logicalDevices === undefined) return undefined;
  const logical = profile.logicalDevices.find(({ id }) => id === logicalId);
  if (logical === undefined) {
    throw new Error(
      `Profile ${profile.id} requires a valid logical device identity`,
    );
  }
  return logical;
}
