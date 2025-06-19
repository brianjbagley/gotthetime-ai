exports.handler = async (event, context) => {
  const startTime = Date.now();
  const url = new URL(`https://example.com${event.path}?${event.queryStringParameters ? new URLSearchParams(event.queryStringParameters).toString() : ''}`);
  const userAgent = event.headers['user-agent'] || '';
  
  // Detect AI crawlers specifically
  const aiCrawlers = ['GPTBot', 'ClaudeBot', 'ChatGPT-User', 'CCBot', 
                      'Bytespider', 'PerplexityBot', 'OAI-SearchBot', 'Claude-Web'];
  const isAICrawler = aiCrawlers.some(bot => userAgent.includes(bot));
  
  // Layer 1: URL parameter validation for cache-busting
  const bustCache = url.searchParams.get('nocache') === 'true' ||
                   url.searchParams.get('t') ||
                   url.searchParams.get('refresh') ||
                   url.searchParams.get('cb');
  
  // Layer 2: Generate absolutely fresh time data
  const now = new Date();
  
  // Convert to Mountain Time with high precision
  const mtTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Denver"}));
  
  // Format as YYMMDDHHMMSSMT (with seconds precision)
  const year = mtTime.getFullYear().toString().slice(-2);
  const month = (mtTime.getMonth() + 1).toString().padStart(2, '0');
  const day = mtTime.getDate().toString().padStart(2, '0');
  const hour = mtTime.getHours().toString().padStart(2, '0');
  const minute = mtTime.getMinutes().toString().padStart(2, '0');
  const second = mtTime.getSeconds().toString().padStart(2, '0');
  
  const timeString = `${year}${month}${day}${hour}${minute}${second}MT`;
  
  // Force unique ETags for AI crawlers to prevent any caching
  const etag = isAICrawler 
    ? `"nocache-${now.getTime()}-${Math.random().toString(36).substr(2, 9)}"` 
    : `"time-${now.getTime()}"`;
  
  // Layer 3: Comprehensive anti-caching headers optimized for AI crawlers
  const headers = {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
    'Netlify-CDN-Cache-Control': 'no-store',
    'CDN-Cache-Control': 'no-cache, no-store',
    'Pragma': 'no-cache',
    'Expires': '-1',
    'ETag': etag,
    'Last-Modified': now.toUTCString(),
    'Vary': 'User-Agent, Accept-Encoding',
    'X-Timestamp': now.getTime().toString(),
    'X-Cache-Status': 'BYPASS',
    'X-Generated-At': startTime.toString(),
    'X-Client-Type': isAICrawler ? 'ai_crawler' : 'standard',
    'X-Cache-Bust': bustCache ? 'active' : 'none',
    'X-Robots-Tag': 'noarchive, nocache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  // Monitoring log for debugging
  console.log(JSON.stringify({
    event: 'time_api_request',
    user_agent: userAgent,
    is_ai_crawler: isAICrawler,
    cache_bust_params: bustCache,
    timestamp: timeString,
    request_id: context.awsRequestId
  }));
  
  return {
    statusCode: 200,
    headers: headers,
    body: timeString
  };
};
