import { MaterialIcon } from "@/components/ui/MaterialIcon";

type CollectionIconProps = {
  className?: string;
};

export function CollectionIcon({ className = "h-5 w-5" }: CollectionIconProps) {
  return <MaterialIcon name="collections_bookmark" size={20} className={className} />;
}
