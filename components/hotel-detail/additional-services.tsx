"use client";

import { AdditionalService } from "@/app/(protected)/hotel/[id]/types";
import { Checkbox } from "@/components/ui/checkbox";

interface AdditionalServicesProps {
  additionals: AdditionalService[];
  selectedAdditionals: string[];
  onAdditionalChange: (serviceId: string, checked: boolean) => void;
}

export function AdditionalServices({
  additionals,
  selectedAdditionals,
  onAdditionalChange,
}: AdditionalServicesProps) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Additional Services
      </h4>
      <div className="space-y-3">
        {additionals.map((service) => {
          const serviceId = String(service.id);
          const isSelected = selectedAdditionals.includes(serviceId);

          return (
            <div key={serviceId} className="flex items-center space-x-3">
              <Checkbox
                id={serviceId}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onAdditionalChange(serviceId, Boolean(checked))
                }
              />
              <label
                htmlFor={serviceId}
                className="text-sm font-medium text-gray-900"
              >
                {service.name}
              </label>
              {service.price > 0 && (
                <span className="text-sm text-gray-600">
                  Rp {service.price.toLocaleString("id-ID")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
