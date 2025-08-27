import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem } from "../ui/form";
import type { ParcelFormType } from "@/pages/dashboard/sender/CreateParcel";

export default function ParcelType({ form }: { form: ParcelFormType }) {
  const id = useId();
  return (
    <FormField
      name="deliveryInfo.deliveryType"
      defaultValue="STANDARD"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <RadioGroup
            className="grid grid-cols-2 gap-2"
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            {/* Radio card #1 */}
            <FormItem>
              <FormControl>
                <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <RadioGroupItem
                    value="STANDARD"
                    id={`${id}-1`}
                    aria-describedby={`${id}-1-description`}
                    className="order-1 after:absolute after:inset-0"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor={`${id}-1`}>Standard Delivery</Label>
                    <p
                      id={`${id}-1-description`}
                      className="text-muted-foreground text-xs"
                    >
                      Parcel will be delivered to your doorstep within 3-7
                      business days.
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
            {/* Radio card #2 */}
            <FormItem>
              <FormControl>
                <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <RadioGroupItem
                    value="EXPRESS"
                    id={`${id}-2`}
                    aria-describedby={`${id}-2-description`}
                    className="order-1 after:absolute after:inset-0"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor={`${id}-2`}>Express Delivery</Label>
                    <p
                      id={`${id}-2-description`}
                      className="text-muted-foreground text-xs"
                    >
                      Parcel will be delivered to your doorstep within 1-2
                      business days.
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}
