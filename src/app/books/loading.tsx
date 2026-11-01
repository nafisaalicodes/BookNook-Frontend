export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner" />
        <p className="text-sm text-[#5A5A5A]">Loading books...</p>
      </div>
    </div>
  )
}
