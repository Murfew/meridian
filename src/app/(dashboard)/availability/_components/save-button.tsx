"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useAvailability } from "@/app/(dashboard)/availability/_components/form";
import { LoadingButton } from "@/components/loading-button";
import { saveAvailabilityAction } from "@/server/actions/availability";
export function AvailabilitySaveButton() {
  const { data } = useAvailability();
  const [isPending, startTransition] = useTransition();

  return (
    <LoadingButton
      type="button"
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await saveAvailabilityAction(data);

          if (result.ok) {
            toast.success("Availability saved successfully!");
          } else {
            toast.error(result.error);
          }
        })
      }
    >
      Save changes
    </LoadingButton>
  );
}
