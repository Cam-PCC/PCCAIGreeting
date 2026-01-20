import { Header } from '@/components/common/Header';
import { VocalizeCard } from '@/components/vocalize-ai/VocalizeCard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-start justify-center">
        <VocalizeCard />
      </main>
    </div>
  );
}
