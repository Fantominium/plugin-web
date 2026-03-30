export interface LocationOption {
  id: string;
  label: string;
  region?: string;
  isActive: boolean;
}

export const LOCATION_OPTIONS: readonly LocationOption[] = [
  { id: 'bridgetown', label: 'Bridgetown', region: 'St. Michael', isActive: true },
  { id: 'christ-church', label: 'Christ Church', region: 'Christ Church', isActive: true },
  { id: 'holetown', label: 'Holetown', region: 'St. James', isActive: true },
  { id: 'st-philip', label: 'St. Philip', region: 'St. Philip', isActive: true },
] as const;

export function isValidLocationId(locationId: string): boolean {
  return LOCATION_OPTIONS.some((option) => option.id === locationId && option.isActive);
}
