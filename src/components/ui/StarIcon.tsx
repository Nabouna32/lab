import { MaterialIcon } from "@/components/ui/MaterialIcon";

type StarIconProps = {
  filled?: boolean;
  className?: string;
};

export function StarIcon({ filled = false, className = "h-5 w-5" }: StarIconProps) {
  return <MaterialIcon name={filled ? "star_fill" : "star"} size={20} className={className} />;
}
