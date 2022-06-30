export type LocationRadius = {|
  latitude: number,
  longitude: number,
  radius: number,
|};

export function locationRadiusToString(locationRadius: LocationRadius): string {
  return `${locationRadius.latitude},${locationRadius.longitude},${locationRadius.radius}`;
}

export function locationRadiusFromString(str: string): LocationRadius {
  const parts: $ReadOnlyArray<string> = str && str.split(",");
  return (
    parts &&
    parts.length > 2 && {
      latitude: parseFloat(parts[0]),
      longitude: parseFloat(parts[1]),
      radius: parseInt(parts[2]),
    }
  );
}
