export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="spinner" />
      <p className="text-sm text-[#5A5A5A]">{text}</p>
    </div>
  )
}
