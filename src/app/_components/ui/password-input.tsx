"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";
import { Input } from "~/app/_components/ui/input";
import { cn } from "~/lib/utils";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        className={cn("pr-8", className)}
        type={visible ? "text" : "password"}
        {...props}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        type="button"
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
