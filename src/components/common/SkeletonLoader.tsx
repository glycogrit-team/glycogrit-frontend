interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'circle' | 'rectangle';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({
  type = 'card',
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg overflow-hidden shadow-elevation-1 ${className}`}>
            <div className="skeleton h-48 w-full" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-4 w-16 rounded" />
              </div>
              <div className="skeleton h-6 w-3/4 rounded" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/6 rounded" />
          </div>
        );

      case 'circle':
        return <div className={`skeleton rounded-full ${className}`} />;

      case 'rectangle':
        return <div className={`skeleton rounded ${className}`} />;

      default:
        return <div className={`skeleton ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fade-in">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
