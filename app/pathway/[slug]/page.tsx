import { notFound } from 'next/navigation';
import { PathwayManager } from '@/lib/pathways/pathway-manager';
import { PathwayData } from '@/lib/pathways/types';
import PathwayPageClient from './PathwayPageClient';

interface PathwayPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all pathways
export async function generateStaticParams() {
  const slugs = PathwayManager.getPathwaySlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each pathway
export async function generateMetadata({ params }: PathwayPageProps) {
  const { slug } = await params;
  const pathway = await PathwayManager.getPathwayBySlug(slug);
  
  if (!pathway) {
    return {
      title: 'Pathway Not Found',
    };
  }

  return {
    title: `${pathway.title} | AI Bootcamp`,
    description: pathway.description,
  };
}

export default async function PathwayPage({ params }: PathwayPageProps) {
  const { slug } = await params;
  const pathway = await PathwayManager.getPathwayBySlug(slug);

  if (!pathway) {
    notFound();
  }

  return <PathwayPageClient pathway={pathway} />;
}