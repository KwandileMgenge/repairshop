import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

function NavButton( { icon: Icon, label, href }: NavButtonProps) {
  return (
    <Button variant="ghost" className="rounded-full" size="icon" aria-label={label} title={label}>
      {href ? (
        <Link href={href} className="flex items-center">
          <Icon className="h-4 w-4" />
        </Link>
      ) : (
        <Icon className="h-4 w-4" />
      )}
    </Button>
  )
}

export default NavButton