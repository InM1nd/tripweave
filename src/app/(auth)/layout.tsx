import Link from "next/link";
import { Plane } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Plane className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">TripWeave</span>
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan your next adventure together
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
