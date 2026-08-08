import { NextRequest, NextResponse } from 'next/server';

// API route to fetch prompts from CMS
// This proxies requests to the Payload CMS and handles authentication

interface CMSPrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  imageCategories?: {
    useCases?: Array<{ title: string }>;
    styles?: Array<{ title: string }>;
    subjects?: Array<{ title: string }>;
  };
  author?: { name: string };
  sourceMedia?: string[];
  featured?: boolean;
}

interface WebsitePrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  style: string;
  author: string;
  image: string;
  featured: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const cmsHost = process.env.NEXT_PUBLIC_CMS_HOST;
    const cmsApiKey = process.env.CMS_API_KEY;

    if (!cmsHost || !cmsApiKey) {
      return NextResponse.json(
        { error: 'CMS configuration not set', fallback: true },
        { status: 503 }
      );
    }

    // Fetch all prompts from CMS
    const query = new URLSearchParams({
      limit: '10000', // Fetch large batch
      depth: '2',
      locale: 'en',
      where: JSON.stringify({
        model: { equals: 'nano-banana-pro' },
      }),
    });

    const url = `${cmsHost}/api/prompts?${query.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `users API-Key ${cmsApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`CMS API error: ${response.status}`);
      return NextResponse.json(
        { error: 'CMS API error', fallback: true },
        { status: 503 }
      );
    }

    const data = await response.json();
    const cmsPrompts: CMSPrompt[] = data.docs || [];

    // Transform CMS prompts to website format
    const transformedPrompts: WebsitePrompt[] = cmsPrompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description || '',
      content: prompt.content,
      category: prompt.imageCategories?.useCases?.[0]?.title || 'General',
      style: prompt.imageCategories?.styles?.[0]?.title || 'Photography',
      author: prompt.author?.name || 'Unknown',
      image: prompt.sourceMedia?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
      featured: prompt.featured || false,
    }));

    return NextResponse.json(transformedPrompts);
  } catch (error) {
    console.error('Error in /api/prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error', fallback: true },
      { status: 500 }
    );
  }
}
