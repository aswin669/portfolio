'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-container-max mx-auto px-gutter pt-32 pb-section-gap text-center">
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-md">Something went wrong</h1>
      <p className="font-body-lg text-body-lg text-secondary mb-stack-lg">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps"
      >
        Try again
      </button>
    </main>
  );
}
