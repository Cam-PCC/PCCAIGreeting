import { Bot } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <Bot className="text-primary-foreground size-6" />
        </div>
        <Link href="/">
            <h1 className="text-2xl font-bold font-headline text-foreground">
            VocalizeAI
            </h1>
        </Link>
      </div>
    </header>
  );
}
