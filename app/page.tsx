import {Button} from '@/components/ui/button';
import { Link } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-home bg-cover bg-center">

      <main className="flex w-full flex-1 flex-col items-center justify-center text-center">

        <div className="bg-background bg-opacity-80 p-8 rounded-lg text-foreground shadow-lg border-2">

          <h1 className="text-3xl font-bold">Repair Shop</h1>
          <address>
            <p>123 Main Street</p>
            <p>Any Town, ZA</p>
          </address>
          <p>Open Hours: 9 AM - 5 PM</p>
          <Button>
            <Link href="tel:123-456-7890">Contact Us</Link> 
          </Button>

        </div>

      </main>

    </div>
  );
}
