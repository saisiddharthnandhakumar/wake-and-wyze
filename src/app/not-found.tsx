import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-6xl font-display font-bold text-sage mb-4">404</p>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-2">
          Page not found
        </h1>
        <p className="text-ink-muted mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-ink text-surface text-sm font-medium hover:bg-sage-deep transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
