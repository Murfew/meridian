"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { saveAvailability } from "@/actions/availability";
import { useAvailability } from "@/components/availability/form";
import { LoadingButton } from "@/components/loading-button";
export function AvailabilitySaveButton() {
  const { data } = useAvailability();
  const [isPending, startTransition] = useTransition();

  return (
    <LoadingButton
      type="button"
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await saveAvailability(data);

          result.ok ? toast.success(result.message) : toast.error(result.error);
        })
      }
    >
      Save changes
    </LoadingButton>
  );
}
