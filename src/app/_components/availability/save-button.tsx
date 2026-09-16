"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useAvailability } from "~/app/_components/availability/form";
import { LoadingButton } from "~/app/_components/loading-button";
import { saveAvailability } from "~/server/actions/availability";
export function AvailabilitySaveButton() {
  const { data } = useAvailability();
  const [isPending, startTransition] = useTransition();

  return (
    <LoadingButton
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await saveAvailability(data);

          result.ok ? toast.success(result.message) : toast.error(result.error);
        })
      }
      type="button"
    >
      Save changes
    </LoadingButton>
  );
}
