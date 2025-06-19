[build]
functions = "netlify/functions"

# Force no caching for time API specifically
[[headers]]
for = "/.netlify/functions/time"
[headers.values]
Cache-Control = "no-cache, no-store, must-revalidate"
Netlify-CDN-Cache-Control = "no-cache, no-store, must-revalidate"
Pragma = "no-cache"
Expires = "0"
X-Robots-Tag = "noarchive, nocache"
Vary = "User-Agent"
