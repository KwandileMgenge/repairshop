import { Button } from "@/components/ui/button";
import { LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

<LoginLink>Sign in</LoginLink>

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <Button>
        <LoginLink>Sign in</LoginLink>
      </Button>
      
    </main>
  );
}