import Header from '@/components/Header';
import Gallery from '@/components/Gallery';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Gallery />
      </main>
    </div>
  );
}
