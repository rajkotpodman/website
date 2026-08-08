# 🚀 Prompt Gallery - Setup Guide

## Quick Start (Sample Data)

The website comes with 10 sample prompts pre-loaded. To run immediately:

```bash
cd website
npm run dev
```

Open http://localhost:3000 to see the gallery.

---

## Connect to Live CMS (15,088+ Prompts)

To access ALL prompts from your Payload CMS:

### Step 1: Get CMS Credentials

You need from your Payload CMS:
- **CMS Host URL** (e.g., `https://cms.example.com`)
- **API Key** (from CMS settings)

### Step 2: Create `.env.local`

In the `website/` folder, create `.env.local`:

```env
NEXT_PUBLIC_CMS_HOST=https://your-cms-host.com
CMS_API_KEY=your-api-key-here
```

**Important:** 
- `NEXT_PUBLIC_CMS_HOST` is exposed to the browser (URL only)
- `CMS_API_KEY` stays secret on the server only
- Keep `.env.local` out of git (it's in `.gitignore`)

### Step 3: Restart the Dev Server

```bash
npm run dev
```

The website will:
1. ✓ Try to fetch from CMS API
2. ✓ Show all 15,088+ prompts if successful
3. ✓ Fall back to sample data if CMS unavailable

---

## API Configuration

### How It Works

```
Browser → website/api/prompts → CMS API
         ↓
    Falls back to sample data if CMS unavailable
```

**API Endpoint:** `/api/prompts` (proxies to CMS)

**Features:**
- Fetches up to 10,000 prompts per request
- Transforms CMS format to website format
- Handles authentication securely (API key server-side only)
- Automatic fallback to sample data

---

## Verify Setup

### Check Browser Console

When the app loads, you'll see:
- ✓ `Loaded 15088 prompts from CMS API` → Success!
- ✓ `Loaded 10 sample prompts from JSON` → Using sample data

### Test Search & Filters

1. Open http://localhost:3000
2. Try searching for a prompt
3. Use category/style filters
4. All 15,088+ prompts should be searchable

---

## Troubleshooting

### "CMS API error" or "503 Service Unavailable"

**Cause:** CMS host or API key is incorrect

**Fix:**
```bash
# Check .env.local
cat .env.local

# Verify CMS is reachable
curl https://your-cms-host.com/api/prompts \
  -H "Authorization: users API-Key YOUR_API_KEY"
```

### Still seeing only 10 sample prompts?

**Check:**
1. `.env.local` exists in `website/` folder
2. `NEXT_PUBLIC_CMS_HOST` is correct
3. `CMS_API_KEY` is valid
4. Restart dev server: `npm run dev`
5. Clear browser cache (Ctrl+Shift+Delete)

### Slow loading with many prompts?

**Solution:** The website handles 15,000+ prompts efficiently with:
- Lazy loading
- Virtualized lists (if needed)
- Optimized filtering

For production, consider:
- Pagination
- Server-side search
- Database indexing

---

## Environment Variables Reference

| Variable | Required | Location | Purpose |
|----------|----------|----------|---------|
| `NEXT_PUBLIC_CMS_HOST` | No | `.env.local` | CMS URL (browser) |
| `CMS_API_KEY` | No | `.env.local` | API Key (server only) |

---

## File Structure

```
website/
├── .env.example           # Copy to .env.local
├── .env.local            # Your actual config (not in git)
├── src/
│   ├── app/
│   │   └── api/
│   │       └── prompts/
│   │           └── route.ts    # CMS proxy endpoint
│   └── lib/
│       └── prompts.ts          # Fetch logic with fallback
└── public/
    └── sample-prompts.json     # Fallback data
```

---

## Next Steps

1. ✅ Get CMS credentials
2. ✅ Create `.env.local` with credentials
3. ✅ Restart dev server
4. ✅ Check browser console for success message
5. ✅ Test with sample search/filters

Your gallery is ready with **15,088+ prompts**! 🎉
