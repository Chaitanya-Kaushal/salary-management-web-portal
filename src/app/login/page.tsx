export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" className="w-full rounded border px-3 py-2" />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button type="submit" className="w-full rounded bg-foreground py-2 text-background">
          Sign in
        </button>
      </form>
    </main>
  );
}
