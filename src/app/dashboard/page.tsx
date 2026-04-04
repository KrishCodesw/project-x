// src/app/dashboard/page.tsx
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // Because this is a Server Component, we fetch the session directly without loading states!
  const session = await auth();

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500">
            Welcome to your protected application.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">User ID:</span> {session?.user?.id}
            </p>
            <p>
              <span className="font-medium">Name:</span> {session?.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session?.user?.email}
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
            className="mt-6"
          >
            <Button variant="destructive" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
