"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { type DaysInput, daysSchema } from "@/lib/validation/availability";
import { saveAvailability } from "@/server/data/availability";

export async function saveAvailabilityAction(
  days: DaysInput,
): Promise<ActionResult<void>> {
  const result = daysSchema.safeParse(days);
  if (!result.success) {
    return {
      ok: false,
      error: "Invalid availability. Please try again.",
    };
  } else {
    await saveAvailability(result.data);
    revalidatePath("/availability");
    return { ok: true, data: undefined };
  }
}
