import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contentType, topic, tone, length, keywords } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate content based on parameters
    const content = generateContent(contentType, topic, tone, length, keywords);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function generateContent(
  contentType: string,
  topic: string,
  tone: string,
  length: string,
  keywords: string
): string {
  const isNewsletter = contentType === 'newsletter';
  const keywordList = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [];

  // Generate title
  const title = isNewsletter
    ? `${topic} - Latest Updates & Insights`
    : `The Latest on ${topic}: What You Need to Know`;

  // Generate introduction
  const introductions = {
    professional: `Welcome to this comprehensive ${isNewsletter ? 'newsletter' : 'article'} focusing on ${topic}. In today's rapidly evolving landscape, staying informed about the latest developments is crucial for professionals and enthusiasts alike.`,
    casual: `Hey there! Let's dive into what's new with ${topic}. Things have been moving fast lately, and there's a lot to catch up on!`,
    friendly: `Hello! I'm excited to share with you the latest updates on ${topic}. There have been some fascinating developments that I think you'll find really interesting.`,
    authoritative: `This ${isNewsletter ? 'newsletter' : 'article'} provides an authoritative overview of recent developments in ${topic}. Based on extensive research and analysis, we present the most significant trends and insights you need to be aware of.`,
    conversational: `So, ${topic} has been getting a lot of attention lately, and for good reason! Let me walk you through what's been happening and why it matters.`,
    enthusiastic: `Exciting times ahead! ${topic} is absolutely buzzing right now, and there's so much happening that you simply can't miss!`
  };

  const intro = introductions[tone as keyof typeof introductions] || introductions.professional;

  // Generate main sections
  const sections = generateSections(topic, tone, length, keywordList, isNewsletter);

  // Generate conclusion
  const conclusions = {
    professional: `As we've explored, ${topic} continues to evolve rapidly. Staying informed and adapting to these changes will be key to success in the coming months. ${isNewsletter ? 'Thank you for reading, and stay tuned for our next edition.' : 'We hope this article has provided valuable insights.'}`,
    casual: `And that's the scoop on ${topic}! Pretty cool stuff, right? ${isNewsletter ? 'See you in the next edition!' : 'Hope you found this helpful!'}`,
    friendly: `Thanks for taking the time to read about ${topic}! I hope you found this information useful. ${isNewsletter ? 'Looking forward to connecting with you again soon!' : 'Feel free to share your thoughts!'}`,
    authoritative: `In conclusion, the developments in ${topic} represent significant shifts that demand attention. Organizations and individuals must remain vigilant and adaptive to these emerging trends.`,
    conversational: `So there you have it - a complete rundown of what's happening with ${topic}. ${isNewsletter ? 'Catch you in the next newsletter!' : 'What do you think about all this?'}`,
    enthusiastic: `What an amazing journey through ${topic}! The future looks incredibly bright, and I can't wait to see what happens next! ${isNewsletter ? 'Until next time, stay awesome!' : 'Keep following along for more updates!'}`
  };

  const conclusion = conclusions[tone as keyof typeof conclusions] || conclusions.professional;

  // Assemble content
  let content = `${title}\n\n`;

  if (isNewsletter) {
    content += `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
  }

  content += `${intro}\n\n`;
  content += sections.join('\n\n');
  content += `\n\n${conclusion}`;

  if (isNewsletter) {
    content += `\n\n---\n\nThis newsletter was created to keep you informed about the latest developments in ${topic}. We hope you found it valuable!`;
  }

  if (keywordList.length > 0) {
    content += `\n\n---\n\nKey Topics: ${keywordList.join(', ')}`;
  }

  return content;
}

function generateSections(
  topic: string,
  tone: string,
  length: string,
  keywords: string[],
  isNewsletter: boolean
): string[] {
  const sectionCount = length === 'short' ? 2 : length === 'medium' ? 3 : 5;
  const sections: string[] = [];

  const sectionTopics = [
    {
      title: 'Current State and Recent Developments',
      content: `The landscape of ${topic} has seen remarkable changes recently. Industry leaders and innovators are pushing boundaries, introducing new approaches and methodologies that are reshaping how we think about this field. Key players have announced significant initiatives that promise to drive further innovation and adoption.

${tone === 'professional' ? 'Market analysis indicates' : 'From what we\'re seeing,'} these developments represent more than incremental improvements - they signal a fundamental shift in approach. Organizations across various sectors are taking notice and adjusting their strategies accordingly.`
    },
    {
      title: 'Key Trends and Insights',
      content: `Several major trends are emerging in ${topic} that deserve attention. First, there's a growing emphasis on innovation and efficiency, with new tools and platforms making it easier than ever to implement cutting-edge solutions. Second, we're seeing increased collaboration across industries, breaking down traditional silos.

${keywords.length > 0 ? `Particularly noteworthy is the focus on ${keywords[0] || 'key innovations'}, which has become a central theme in recent discussions.` : 'This collaborative approach is yielding impressive results and opening up new possibilities.'}

The data shows consistent growth and adoption, with early adopters reporting positive outcomes. This momentum is likely to continue as more organizations recognize the value proposition.`
    },
    {
      title: 'Impact and Implications',
      content: `The implications of these developments in ${topic} extend far beyond the immediate field. We're seeing ripple effects across related industries and disciplines, creating new opportunities and challenges. For professionals in this space, staying current with these changes is becoming increasingly important.

Looking at the broader picture, these advancements are contributing to significant shifts in how businesses operate and how consumers interact with technology and services. The potential for positive impact is substantial, though it comes with the need for thoughtful implementation and consideration of various stakeholders.`
    },
    {
      title: 'Expert Perspectives and Analysis',
      content: `Industry experts have weighed in on ${topic}, offering valuable perspectives on what these changes mean. The consensus points to sustained growth and evolution, with innovation continuing at a rapid pace. Thought leaders emphasize the importance of adaptability and continuous learning in this dynamic environment.

${keywords.length > 1 ? `Particular attention is being paid to ${keywords[1] || 'emerging patterns'}, which experts identify as a key driver of future developments.` : 'The analytical frameworks being developed help us better understand the underlying dynamics at play.'}

Research indicates that organizations that embrace these changes early tend to gain competitive advantages, while those that hesitate risk falling behind.`
    },
    {
      title: 'Looking Ahead: Future Outlook',
      content: `As we look to the future of ${topic}, the outlook appears promising. Continued innovation, increased investment, and growing awareness are all contributing to a positive trajectory. We can expect to see further developments that build on current foundations while introducing new capabilities and approaches.

${isNewsletter ? 'In our next edition, we\'ll dive deeper into specific aspects of these trends and explore practical applications.' : 'The coming months will be crucial as various initiatives mature and new data becomes available.'} Staying informed and engaged will be essential for anyone involved in or affected by this field.

The potential for transformative impact remains high, and early indicators suggest we're only beginning to scratch the surface of what's possible.`
    }
  ];

  for (let i = 0; i < Math.min(sectionCount, sectionTopics.length); i++) {
    const section = sectionTopics[i];
    sections.push(`## ${section.title}\n\n${section.content}`);
  }

  return sections;
}
