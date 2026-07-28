import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-4xl font-semibold">Page not found</h1>
        <Link className="mt-6 inline-block" to="/">
          <Button>Return home</Button>
        </Link>
      </div>
    </main>
  );
}
