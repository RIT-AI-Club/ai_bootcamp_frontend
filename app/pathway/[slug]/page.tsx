import { notFound } from 'next/navigation';
import { PathwayManager } from '@/lib/pathways/pathway-manager';
import { PathwayData } from '@/lib/pathways/types';

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

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <a 
              href="/dashboard" 
              className="text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 font-semibold tracking-wider"
            >
              ← BACK TO DASHBOARD
            </a>
          </div>
          
          {/* Pathway Hero */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${pathway.color} opacity-20 mb-4`}>
              <span className="text-sm font-semibold text-gray-100/90">
                {pathway.level.toUpperCase()} • {pathway.duration}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-wider text-gray-100/95 mb-4">
              {pathway.title}
            </h1>
            
            <p className="text-lg text-neutral-400 mb-6 max-w-2xl mx-auto">
              {pathway.description}
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
              <span>👨‍🏫 {pathway.instructor}</span>
              <span>📈 {pathway.progress}% Complete</span>
              <span>⭐ {pathway.rating}/5</span>
              <span>👥 {pathway.enrolledCount?.toLocaleString()} enrolled</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-6 md:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            
            {/* Progress Bar */}
            <div className="mb-8 bg-neutral-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100/95">Your Progress</h3>
                <span className="text-sm text-neutral-400">{pathway.progress}% Complete</span>
              </div>
              <div className="w-full bg-neutral-700/30 rounded-full h-3">
                <div
                  className={`h-full bg-gradient-to-r ${pathway.color} transition-all duration-700 ease-out rounded-full`}
                  style={{ width: `${pathway.progress}%` }}
                />
              </div>
            </div>

            {/* Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-neutral-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30">
                <h2 className="text-2xl font-bold text-gray-100/95 mb-4">Overview</h2>
                <p className="text-neutral-300 leading-relaxed">{pathway.overview}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-100/95 mb-3">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    {pathway.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-neutral-300">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                {/* Prerequisites */}
                <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30">
                  <h3 className="text-lg font-semibold text-gray-100/95 mb-3">Prerequisites</h3>
                  <ul className="space-y-2">
                    {pathway.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-neutral-300 text-sm">• {prereq}</li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30">
                  <h3 className="text-lg font-semibold text-gray-100/95 mb-3">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {pathway.tools.map((tool, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-neutral-700/50 rounded-full text-xs text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30">
              <h2 className="text-2xl font-bold text-gray-100/95 mb-6">Course Modules</h2>
              <div className="space-y-4">
                {pathway.modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className={`border border-neutral-700/30 rounded-xl p-6 transition-all duration-200 ${
                      module.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-neutral-700/20 hover:bg-neutral-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-100/95">
                        {index + 1}. {module.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          module.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {module.difficulty}
                        </span>
                        <span className="text-sm text-neutral-400">{module.duration}</span>
                        {module.completed && <span className="text-green-400">✓</span>}
                      </div>
                    </div>
                    
                    <p className="text-neutral-300 mb-4">{module.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, topicIndex) => (
                        <span 
                          key={topicIndex}
                          className="px-2 py-1 bg-neutral-600/30 rounded text-xs text-neutral-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}