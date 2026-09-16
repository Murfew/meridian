import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "~/server/better-auth";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
