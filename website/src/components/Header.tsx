'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">🚀 Prompt Gallery</h1>
            <p className="text-blue-100 mt-2">
              Discover and explore beautiful AI prompts for Nano Banana Pro
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Curated Collection</p>
          </div>
        </div>
      </div>
    </header>
  );
}
