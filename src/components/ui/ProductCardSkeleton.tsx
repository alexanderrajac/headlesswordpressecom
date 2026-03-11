export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-full w-full" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/2" />
        <div className="h-6 skeleton rounded-full w-2/5" />
      </div>
    </div>
  );
}
