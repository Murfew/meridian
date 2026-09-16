import type * as React from "react";
import { Button } from "~/app/_components/ui/button";
import { Spinner } from "~/app/_components/ui/spinner";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
};

export function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Spinner />}
      {children}
    </Button>
  );
}
