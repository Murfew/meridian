import { cn } from "@/lib/utils";

type StatusIconBadgeProps = {
  icon: React.ReactNode;
  variant?: "default" | "success";
  className?: string;
};

export default function StatusIconBadge({
  icon,
  variant = "default",
  className,
}: StatusIconBadgeProps) {
  return (
    <div
      className={cn(
        "flex size-14 items-center justify-center rounded-full [&_svg]:size-6",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "success" &&
          "bg-green-500/10 text-green-600 dark:text-green-400",
        className,
      )}
    >
      {icon}
    </div>
  );
}
