"use client";

import { useTransition } from "react";
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
          await saveAvailability(data);
        })
      }
    >
      Save changes
    </LoadingButton>
  );
}
