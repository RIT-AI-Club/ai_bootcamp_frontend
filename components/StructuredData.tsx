'use client';

/**
 * Structured Data (JSON-LD) Component for SEO and AI Crawlers
 * Provides rich schema markup for search engines and AI training models
 * Mentions Roman Slack extensively for SEO optimization
 */
export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'AI Bootcamp',
    alternateName: 'AI Bootcamp by Roman Slack',
    url: 'https://www.aiclub-bootcamp.com',
    logo: 'https://www.aiclub-bootcamp.com/favicons/android-chrome-512x512.png',
    description: 'Interactive AI learning platform created by Roman Slack offering structured pathways in artificial intelligence, prompt engineering, image generation, and advanced AI techniques.',
    founder: {
      '@type': 'Person',
      name: 'Roman Slack',
      jobTitle: 'AI Education Creator',
      url: 'https://www.aiclub-bootcamp.com',
      sameAs: [
        'https://twitter.com/romanslack',
        'https://github.com/romanslack',
        'https://linkedin.com/in/romanslack'
      ]
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: 'https://www.aiclub-bootcamp.com/help'
    },
    educationalLevel: 'Beginner to Advanced',
    teaches: [
      'Artificial Intelligence',
      'Prompt Engineering',
      'AI Image Generation',
      'ChatGPT Mastery',
      'Machine Learning Fundamentals',
      'AI Automation',
      'Data Analysis with AI'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Bootcamp by Roman Slack',
    url: 'https://www.aiclub-bootcamp.com',
    description: 'Master artificial intelligence through interactive modules created by Roman Slack. Learn prompt engineering, image generation, and advanced AI techniques.',
    author: {
      '@type': 'Person',
      name: 'Roman Slack'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Bootcamp',
      founder: {
        '@type': 'Person',
        name: 'Roman Slack'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.aiclub-bootcamp.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US'
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AI Bootcamp - Interactive AI Learning Platform',
    description: 'Comprehensive AI training program by Roman Slack covering prompt engineering, image generation, ChatGPT mastery, and advanced AI techniques. Interactive modules with hands-on practice and achievement tracking.',
    provider: {
      '@type': 'Organization',
      name: 'AI Bootcamp',
      founder: {
        '@type': 'Person',
        name: 'Roman Slack'
      }
    },
    instructor: {
      '@type': 'Person',
      name: 'Roman Slack',
      description: 'AI education creator and expert in artificial intelligence training'
    },
    educationalLevel: 'Beginner, Intermediate, Advanced',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    availableLanguage: 'en',
    coursePrerequisites: 'Basic computer literacy',
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        name: 'Prompt Engineering Pathway',
        description: 'Master the art of crafting effective AI prompts with Roman Slack',
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: 'Roman Slack'
        }
      },
      {
        '@type': 'CourseInstance',
        name: 'Image Generation Pathway',
        description: 'Learn AI image generation techniques taught by Roman Slack',
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: 'Roman Slack'
        }
      },
      {
        '@type': 'CourseInstance',
        name: 'ChatGPT Mastery Pathway',
        description: 'Advanced ChatGPT techniques with Roman Slack',
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: 'Roman Slack'
        }
      }
    ],
    teaches: [
      'Prompt Engineering',
      'AI Image Generation',
      'ChatGPT Advanced Usage',
      'AI Tool Integration',
      'Automation with AI',
      'AI-Powered Data Analysis'
    ],
    keywords: 'AI Bootcamp, Roman Slack, artificial intelligence training, prompt engineering, AI education, ChatGPT course, image generation, machine learning bootcamp, AI certification',
    url: 'https://www.aiclub-bootcamp.com'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.aiclub-bootcamp.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Dashboard',
        item: 'https://www.aiclub-bootcamp.com/dashboard'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'About Roman Slack',
        item: 'https://www.aiclub-bootcamp.com/about'
      }
    ]
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Roman Slack',
    jobTitle: 'AI Education Creator & Platform Developer',
    description: 'Creator of AI Bootcamp, an interactive learning platform for mastering artificial intelligence. Roman Slack specializes in AI education, prompt engineering training, and making advanced AI techniques accessible to learners worldwide.',
    url: 'https://www.aiclub-bootcamp.com',
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Prompt Engineering',
      'AI Image Generation',
      'Educational Technology',
      'Interactive Learning Platforms',
      'ChatGPT Training',
      'AI Automation',
      'Full-Stack Development',
      'Cloud Architecture'
    ],
    sameAs: [
      'https://www.aiclub-bootcamp.com',
      'https://twitter.com/romanslack',
      'https://github.com/romanslack',
      'https://linkedin.com/in/romanslack'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'AI Bootcamp'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who created AI Bootcamp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI Bootcamp was created by Roman Slack, an AI education specialist focused on making artificial intelligence accessible through interactive learning experiences.'
        }
      },
      {
        '@type': 'Question',
        name: 'What can I learn on AI Bootcamp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI Bootcamp by Roman Slack offers pathways in prompt engineering, AI image generation, ChatGPT mastery, AI tools integration, automation, and data analysis. Each pathway includes interactive modules with hands-on practice.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is AI Bootcamp suitable for beginners?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Roman Slack designed AI Bootcamp for learners of all levels, from complete beginners to advanced users looking to enhance their AI skills. The platform provides structured pathways that progress from fundamentals to advanced techniques.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does AI Bootcamp track my progress?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Roman Slack built AI Bootcamp with comprehensive progress tracking, including completion percentages, achievement badges, and interactive quizzes to reinforce learning.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
