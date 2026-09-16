import type { SearchParams, SearchParamsPatch } from '@/shared/lib/search-params';
import { Chip } from '@/shared/ui/chip';

interface FilterChipsProps {
  value: SearchParams;
  onChange: (patch: SearchParamsPatch) => void;
}

interface ChipDescriptor {
  key: keyof SearchParams;
  label: string;
}

function describeChips(params: SearchParams): ChipDescriptor[] {
  const chips: ChipDescriptor[] = [];
  if (params.category !== undefined) {
    chips.push({ key: 'category', label: `Category: ${params.category}` });
  }
  if (params.brand !== undefined) {
    chips.push({ key: 'brand', label: `Brand: ${params.brand}` });
  }
  if (params.availability !== undefined) {
    chips.push({ key: 'availability', label: `Availability: ${params.availability}` });
  }
  if (params.price_min !== undefined) {
    chips.push({ key: 'price_min', label: `Min price: ${params.price_min}` });
  }
  if (params.price_max !== undefined) {
    chips.push({ key: 'price_max', label: `Max price: ${params.price_max}` });
  }
  if (params.rating_min !== undefined) {
    chips.push({ key: 'rating_min', label: `Min rating: ${params.rating_min}` });
  }
  if (params.rating_max !== undefined) {
    chips.push({ key: 'rating_max', label: `Max rating: ${params.rating_max}` });
  }
  return chips;
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  const chips = describeChips(value);
  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Chip
            removeLabel={`Remove ${String(chip.key)} filter`}
            onRemove={() => onChange({ [chip.key]: undefined })}
          >
            {chip.label}
          </Chip>
        </li>
      ))}
    </ul>
  );
}
