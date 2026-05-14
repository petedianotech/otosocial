import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { isManual, text, platforms } = body;

    let socialText = "";
    let articleTitle = "";
    let articleMd = "";

    if (isManual) {
      if (!text || text.trim().length === 0) {
        throw new Error("Content cannot be empty for manual posts.");
      }
      socialText = text.trim();
      articleMd = text.trim();
      const lines = text.trim().split('\n');
      articleTitle = lines[0].length > 60 ? lines[0].substring(0, 57) + "..." : lines[0];
    } else {
      let geminiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim();
      
      if (!geminiKey) {
        throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in Vercel settings.");
      }

      // Check for valid key format (basic check)
      if (geminiKey.length < 10) {
        throw new Error("The Gemini API Key provided seems too short or invalid. Please check your Vercel Environment Variables.");
      }

      const ai = new GoogleGenerativeAI(geminiKey);
      
      const promptText = `
      You are Peter Damiano, an ambitious Full Stack Developer and AI enthusiast aiming to rank as the #1 software developer in Malawi.
      Your personal website is https://peterdamiano.vercel.app.
      
      Think of a fascinating, CURRENT (non-repetitive) topic in AI breakthroughs or software development. DO NOT write about RAG (Retrieval-Augmented Generation) again; pick something fresh, like local LLMs, AI agents, new web frameworks, performance optimization, edge computing, backend scaling, etc.

      Write a compelling, human-sounding, and engaging social media post (for X and LinkedIn) and a highly professional, in-depth Markdown article (for Dev.to and Blogger).

      CRITICAL SEO & ENGAGEMENT INSTRUCTIONS:
      1. Make the article title extremely catchy, punchy, click-worthy, and SEO-optimized. Use trending keywords, ask provocative questions, or use numbers to boost engagement.
      2. The title must compel developers to click and read. It must be professional but highly attention-grabbing.
      3. Naturally weave in SEO keywords related to your goals in the article body: "Full Stack Developer", "AI & Future", "Software Developer in Malawi".

      In the article, include a brief, natural tie-in to your persona/website (Peter Damiano, https://peterdamiano.vercel.app) to personalize it. Establish authority as a top developer in Malawi sharing valuable insights.
      
      Respond STRICTLY in JSON format:
      {
          "social_post": "Engaging post text (include trending hashtags)",
          "article_title": "Catchy, view-driving, SEO-optimized article title",
          "article_markdown": "The full professional markdown article body including code snippets if relevant, SEO keywords, and a genuine author sign-off linking to your site."
      }
      `;

      // The user insisted on Gemini 3.1 flash-light or Gemini 3 flash.
      const modelName = 'gemini-3.1-flash-light';
      
      let model;
      try {
        model = ai.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
          }
        });
      } catch (me: any) {
        throw new Error(`Failed to initialize model ${modelName}: ${me.message}`);
      }

      const result = await model.generateContent(promptText);
      const contentText = result.response.text();
      
      if (!contentText) {
        throw new Error('No content returned from Gemini');
      }

      // Clean up potential markdown guards
      let cleanedText = contentText.trim();
      if (cleanedText.startsWith("```")) {
        const lines = cleanedText.split('\n');
        if (lines[0].startsWith("```")) lines.shift();
        if (lines.length > 0 && lines[lines.length - 1].startsWith("```")) lines.pop();
        cleanedText = lines.join('\n').trim();
      }

      const contentJson = JSON.parse(cleanedText);
      socialText = contentJson.social_post;
      articleTitle = contentJson.article_title;
      articleMd = contentJson.article_markdown;
    }

    const articleHtml = articleMd.replace(/\n/g, "<br/>");
    const results: any = {};
    const selectedPlatforms = platforms || { x: true, linkedin: true, devto: true, blogger: true };

    // 1. LinkedIn
    if (selectedPlatforms.linkedin) {
      if (process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN) {
        try {
          const liRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
              'X-Restli-Protocol-Version': '2.0.0',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "author": `urn:li:person:${process.env.LINKEDIN_PERSON_URN}`,
              "lifecycleState": "PUBLISHED",
              "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                  "shareCommentary": { "text": socialText },
                  "shareMediaCategory": "NONE"
                }
              },
              "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
            })
          });
          results.linkedin = liRes.ok ? 'Success' : `Error: ${await liRes.text()}`;
        } catch (e: any) {
          results.linkedin = `Exception: ${e.message}`;
        }
      } else {
        results.linkedin = 'Skipped (No Config)';
      }
    } else {
        results.linkedin = 'Unselected';
    }

    // 2. X (Twitter)
    if (selectedPlatforms.x) {
      if (process.env.X_CONSUMER_KEY && process.env.X_ACCESS_TOKEN) {
        try {
          const twitterClient = new TwitterApi({
            appKey: process.env.X_CONSUMER_KEY,
            appSecret: process.env.X_CONSUMER_SECRET!,
            accessToken: process.env.X_ACCESS_TOKEN,
            accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
          });
          
          let tweetText = socialText;
          if (tweetText.length > 280) tweetText = tweetText.substring(0, 277) + "...";
          
          await twitterClient.v2.tweet(tweetText);
          results.x = 'Success';
        } catch (e: any) {
          results.x = `Exception: ${e.message}`;
        }
      } else {
        results.x = 'Skipped (No Config)';
      }
    } else {
        results.x = 'Unselected';
    }

    // 3. Dev.to
    if (selectedPlatforms.devto) {
      if (process.env.DEVTO_API_KEY) {
        try {
          const devRes = await fetch("https://dev.to/api/articles", {
            method: 'POST',
            headers: {
              "api-key": process.env.DEVTO_API_KEY,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "article": {
                "title": articleTitle,
                "body_markdown": articleMd,
                "published": true,
                "tags": ["ai", "software", "tech"]
              }
            })
          });
          results.devto = devRes.ok ? 'Success' : `Error: ${await devRes.text()}`;
        } catch (e: any) {
           results.devto = `Exception: ${e.message}`;
        }
      } else {
        results.devto = 'Skipped (No Config)';
      }
    } else {
      results.devto = 'Unselected';
    }

    // 4. Blogger
    if (selectedPlatforms.blogger) {
      if (process.env.BLOGGER_ACCESS_TOKEN && process.env.BLOGGER_BLOG_ID) {
        try {
          const bloggerRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${process.env.BLOGGER_BLOG_ID}/posts`, {
             method: 'POST',
             headers: {
               "Authorization": `Bearer ${process.env.BLOGGER_ACCESS_TOKEN}`,
               "Content-Type": "application/json"
             },
             body: JSON.stringify({
                "title": articleTitle,
                "content": articleHtml,
                "labels": ["AI", "Software Development", "Future"]
             })
          });
          results.blogger = bloggerRes.ok ? 'Success' : `Error: ${await bloggerRes.text()}`;
        } catch (e: any) {
          results.blogger = `Exception: ${e.message}`;
        }
      } else {
        results.blogger = 'Skipped (No Config)';
      }
    } else {
        results.blogger = 'Unselected';
    }

    return NextResponse.json({ success: true, results, title: isManual ? "Manual Post" : articleTitle });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
