import { Container } from "@/components/ui/container";
import { getPosts } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  let posts;
  try {
    posts = await getPosts();
  } catch (error) {
    const message = error instanceof Error ? error.stack : String(error);
    return (
      <Container className="space-y-6 py-10">
        <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-white">
          <p className="text-lg font-semibold">Strapi fetch failed</p>
          <pre className="mt-4 overflow-auto text-sm text-white/80">{message}</pre>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-6 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <p className="text-lg font-semibold">Strapi Debug</p>
        <p className="text-sm text-white/70">Posts fetched by the server component.</p>
      </div>
      <pre className="overflow-auto rounded-3xl border border-white/10 bg-black/60 p-6 text-sm text-[var(--accent)]">
        {JSON.stringify(posts, null, 2)}
      </pre>
    </Container>
  );
}
