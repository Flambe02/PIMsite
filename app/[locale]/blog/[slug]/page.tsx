import { BlogArticle } from '@/components/blog/BlogArticle';

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogArticle slug={slug} />
    </div>
  );
} 