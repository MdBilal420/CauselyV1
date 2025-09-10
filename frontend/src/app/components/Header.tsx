import Link from "next/link";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("w-full border-b border-border/40", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Causely</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/copilotkit"
            className="text-sm font-medium transition-colors hover:text-primary">
            Philanthropy Advisor
          </Link>
        </nav>

        {/* <div className="flex items-center gap-4">
          <Link
            href="/copilotkit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Start Giving
          </Link>
        </div> */}
      </div>
    </header>
  );
}
