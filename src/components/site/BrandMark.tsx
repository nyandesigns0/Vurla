import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  inverse?: boolean;
  showWordmark?: boolean;
};

export function BrandMark({ className = "", inverse = false, showWordmark = false }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={inverse ? "/brand/vurla-mark-inverse.svg" : "/brand/vurla-mark.svg"}
        alt="Vurla"
        width={48}
        height={48}
        className="h-full w-auto object-contain"
      />
      {showWordmark && (
        <span className="brand-wordmark">Vurla</span>
      )}
    </span>
  );
}
