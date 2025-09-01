import Link from 'next/link';

export default function PathwayNotFound() {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-wider text-gray-100/95 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100/80 mb-6">
            Pathway Not Found
          </h2>
          <p className="text-lg text-neutral-400 mb-8 max-w-md mx-auto">
            The pathway you're looking for doesn't exist or may have been moved.
          </p>
          <Link 
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}