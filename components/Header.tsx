import React from 'react'
import NavButton from './NavButton'
import { File, HomeIcon, LogOut, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from './ModeToggle'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Button } from './ui/button'

function Header() {
  return (
    <header className="bg-background text-foreground p-4 sticky top-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NavButton icon={HomeIcon} label="Home" href="/home" />
          <Link href="/home" className="text-foreground hover:text-foreground/80" title="Home">
            <h1 className="text-lg font-bold">Repair Shop</h1>
          </Link>
        </div>
        <div>
          <NavButton icon={UsersRound} label="Customers" href="/customers" />
          <NavButton icon={File} label="Tickets" href="/tickets" />
          <ModeToggle />

          <Button>
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header