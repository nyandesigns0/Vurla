/* Skeleton utility components for loading states */

export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{
            width: i === lines - 1 ? "80%" : "100%",
            marginBottom: i === lines - 1 ? 0 : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = "" }: { className?: string }) {
  return <div className={`skeleton skeleton-image ${className}`} />;
}

export function SkeletonCard({ showImage = true, lines = 3, className = "" }: { showImage?: boolean; lines?: number; className?: string }) {
  return (
    <div className={`skeleton-card border ${className}`} style={{ borderColor: "var(--border)" }}>
      {showImage && <SkeletonImage className="!rounded-t-lg !rounded-b-none" />}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton skeleton-text" style={{ width: "60px", height: "24px" }} />
          <div className="skeleton skeleton-text" style={{ width: "40px", height: "16px" }} />
        </div>
        <SkeletonText lines={lines} className="mb-4" />
        <div className="skeleton skeleton-button" />
      </div>
    </div>
  );
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return <div className={`skeleton skeleton-button ${className}`} />;
}

export function SkeletonCircle({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`skeleton rounded-full ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
