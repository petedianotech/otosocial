import os
import json
import logging
import requests
import time
import sys
from requests_oauthlib import OAuth1Session

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- CONFIGURATION & SECRETS ---
# Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# LinkedIn
LINKEDIN_ACCESS_TOKEN = os.environ.get("LINKEDIN_ACCESS_TOKEN")
LINKEDIN_PERSON_URN = os.environ.get("LINKEDIN_PERSON_URN")

# X (Twitter) - Free Tier uses OAuth 1.0a
X_CONSUMER_KEY = os.environ.get("X_CONSUMER_KEY")
X_CONSUMER_SECRET = os.environ.get("X_CONSUMER_SECRET")
X_ACCESS_TOKEN = os.environ.get("X_ACCESS_TOKEN")
X_ACCESS_TOKEN_SECRET = os.environ.get("X_ACCESS_TOKEN_SECRET")

# Dev.to
DEVTO_API_KEY = os.environ.get("DEVTO_API_KEY")

# Blogger
BLOGGER_ACCESS_TOKEN = os.environ.get("BLOGGER_ACCESS_TOKEN")
BLOGGER_BLOG_ID = os.environ.get("BLOGGER_BLOG_ID")


def generate_content():
    """Uses Gemini 3.1 Flash Lite to generate a post and Dev.to article."""
    logging.info("Generating content with Gemini 3.1 Flash Lite...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={GEMINI_API_KEY}"
    
    prompt = """
    You are an autonomous AI & Software engineering content creator.
    Think of a trending AI breakthrough or software development trend from your internal knowledge.
    Write a concise social media post (for X and LinkedIn) and a full-length Markdown article (for Dev.to and Blogger).
    
    Respond STRICTLY in JSON format:
    {
        "social_post": "The post text (include hashtags)",
        "article_title": "The article title",
        "article_markdown": "The full markdown article body including code snippets if relevant"
    }
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    
    max_retries = 4
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Content Extraction
            try:
                content_text = data['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError, TypeError):
                logging.error(f"Gemini returned an empty or invalid candidate structure: {data}")
                return None

            # Clean up potential markdown guards if AI ignored responseMimeType
            cleaned_text = content_text.strip()
            if cleaned_text.startswith("```"):
                # Usually ```json ... ```
                lines = cleaned_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                cleaned_text = "\n".join(lines).strip()
            
            if not cleaned_text:
                logging.error("Cleaned text is empty.")
                return None

            content_json = json.loads(cleaned_text)
            return content_json
            
        except requests.exceptions.HTTPError as e:
            if response.status_code == 429:
                logging.warning(f"Rate limited (429). Retrying in {retry_delay} seconds... (Attempt {attempt+1}/{max_retries})")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                logging.error(f"HTTP Error: {e}")
                return None
        except json.JSONDecodeError as e:
            logging.error(f"JSON Parsing Error: {e}")
            logging.error(f"Raw text attempting to parse: {content_text}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return None
    else:
        logging.error("Max retries exceeded for Gemini API.")
        return None

def generate_image(prompt):
    """Placeholder for Imagen 4 via API. Currently no standard Imagen 4 REST endpoint without GCP Vertex setup, simulating."""
    logging.info(f"Generating Imagen 4 visual for prompt: '{prompt[:50]}...'")
    # In a real Vertex AI environment, you would use aiplatform SDK here.
    # We will return a placeholder realistic image URL for testing.
    return "https://picsum.photos/seed/ai-tech/800/400"

def post_to_linkedin(text):
    """Post to LinkedIn."""
    if not LINKEDIN_ACCESS_TOKEN or not LINKEDIN_PERSON_URN:
        logging.warning("Skipping LinkedIn post: Missing credentials.")
        return
    logging.info("Posting to LinkedIn...")
    url = 'https://api.linkedin.com/v2/ugcPosts'
    headers = {
        'Authorization': f'Bearer {LINKEDIN_ACCESS_TOKEN}',
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json'
    }
    payload = {
        "author": f"urn:li:person:{LINKEDIN_PERSON_URN}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }
    resp = requests.post(url, headers=headers, json=payload)
    if resp.status_code == 201:
        logging.info("Successfully posted to LinkedIn.")
    else:
        logging.error(f"LinkedIn Error: {resp.text}")

def post_to_x(text):
    """Post to X (Twitter) using Free Tier (OAuth 1.0a)."""
    if not X_CONSUMER_KEY or not X_ACCESS_TOKEN:
        logging.warning("Skipping X post: Missing credentials.")
        return
    logging.info("Posting to X (Twitter)...")
    url = "https://api.twitter.com/2/tweets"
    
    # Trim to 280 chars if necessary
    if len(text) > 280:
        text = text[:277] + "..."
        
    payload = {"text": text}
    auth = OAuth1Session(X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)
    
    resp = auth.post(url, json=payload)
    if resp.status_code == 201:
        logging.info("Successfully posted to X.")
    elif resp.status_code == 401:
        logging.error("X Error 401: Unauthorized. Your tokens might be invalid or expired.")
    elif resp.status_code == 403:
        logging.error("X Error 403: Forbidden. IMPORTANT: Check if your X App has 'Read and Write' permissions and regenerate tokens.")
    else:
        logging.error(f"X Error {resp.status_code}: {resp.text}")

def post_to_devto(title, body_markdown):
    """Post to Dev.to using API."""
    if not DEVTO_API_KEY:
        logging.warning("Skipping Dev.to post: Missing credentials.")
        return
    logging.info("Posting to Dev.to...")
    url = "https://dev.to/api/articles"
    headers = {
        "api-key": DEVTO_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "article": {
            "title": title,
            "body_markdown": body_markdown,
            "published": True,
            "tags": ["ai", "software", "tech"]
        }
    }
    resp = requests.post(url, headers=headers, json=payload)
    if resp.status_code == 201:
        logging.info("Successfully posted to Dev.to.")
    else:
        logging.error(f"Dev.to Error: {resp.text}")

def post_to_blogger(title, content_html):
    """Post to Blogger via Google API."""
    if not BLOGGER_ACCESS_TOKEN or not BLOGGER_BLOG_ID:
        logging.warning("Skipping Blogger post: Missing credentials.")
        return
    logging.info("Posting to Blogger...")
    url = f"https://www.googleapis.com/blogger/v3/blogs/{BLOGGER_BLOG_ID}/posts"
    headers = {
        "Authorization": f"Bearer {BLOGGER_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "title": title,
        "content": content_html,
        "labels": ["AI", "Software Development", "2026 Trends"]
    }
    resp = requests.post(url, headers=headers, json=payload)
    if resp.status_code == 200:
        logging.info("Successfully posted to Blogger.")
    else:
        logging.error(f"Blogger Error: {resp.text}")

def main():
    logging.info("--- Starting OtoSocial Execution ---")
    
    if not GEMINI_API_KEY:
        logging.error("GEMINI_API_KEY is not set in GitHub secrets. Please add it to generate content. Exiting.")
        sys.exit(1)
        
    content = generate_content()
    if not content:
        logging.error("No content generated due to Gemini AI error. Exiting.")
        sys.exit(1)
        
    social_text = content.get('social_post', '')
    article_title = content.get('article_title', '')
    article_md = content.get('article_markdown', '')
    
    logging.info(f"Generated Social Text: {social_text[:50]}...")
    logging.info(f"Generated Article Title: {article_title}")
    
    # For Blogger, we need HTML.
    article_html = article_md.replace("\n", "<br/>")
    
    # 1. Post to LinkedIn
    post_to_linkedin(social_text)
    
    # 2. Post to X
    post_to_x(social_text)
    
    # 3. Post to Dev.to
    post_to_devto(article_title, article_md)
    
    # 4. Post to Blogger
    post_to_blogger(article_title, article_html)
    
    logging.info("--- OtoSocial Execution Complete ---")

if __name__ == "__main__":
    main()
