import { getPosts } from "@/lib/api"; 
import CategoryFilter from "@/components/blog/CategoryFilter";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "The Plog | Productivity Gourmet",
  description: "Real talk on client communications, systems that actually work, and what it takes to run a service-based business without burning out."
};

const CATEGORIES = ["All", "Operations", "Client Communications", "Systems", "Mindset", "Tools"];

export default async function PlogPage() {
  const posts = await getPosts();

  return (
    <main id="main-content">
      <PublicHeader />
      <section aria-labelledby="plog-heading" style={{ padding: '4rem 1.5rem', background: 'var(--color-bg-hero)', textAlign: 'center' }}>
        <div>
          <p aria-hidden="true" style={{ color: 'var(--color-primary-text)', fontWeight: 600 }}>— The Plog</p>
          <h1 id="plog-heading" style={{ marginBottom: '1rem' }}>
            Behind the <em>Operations</em>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-muted)' }}>
            Real talk on client communications, systems that actually work, and what
            it takes to run a service-based business without burning out.
          </p>
        </div>
      </section>

      <section aria-label="Blog posts" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <CategoryFilter categories={CATEGORIES} allPosts={posts} />
      </section>
      <PublicFooter/>
    </main>
  );
}