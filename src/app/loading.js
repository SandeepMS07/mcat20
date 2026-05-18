"use client";

export default function LoadingPage() {
  return (
    <div className="fixed left-0 top-0 z-[1000] flex min-h-screen w-full flex-col items-center justify-center bg-[#101b52]">
      <div
        role="status"
        aria-label="Loading"
        className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"
      />
    </div>
  );
}
