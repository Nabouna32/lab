import { MaterialIcon } from "@/components/ui/MaterialIcon";

type StarIconProps = {
  filled?: boolean;
  className?: string;
  size?: number;
};

export function StarIcon({ filled = false, className = "h-5 w-5", size = 20 }: StarIconProps) {
  return <MaterialIcon name={filled ? "star_fill" : "star"} size={size} className={className} />;
}
