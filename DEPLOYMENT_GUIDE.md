# Complete Deployment Guide 🚀

## Issues Fixed ✅

### 1. TypeScript Build Error

- **Fixed**: Return type in `lib/session.ts` to handle null user
- **Fixed**: Added proper error handling in analytics functions

### 2. Network Connection Error

- **Fixed**: Replaced HTTP calls with direct database functions
- **Fixed**: No more `ECONNREFUSED` errors in Docker

### 3. Authentication Issues

- **Fixed**: Added debug logging for authentication flow
- **Fixed**: Proper session handling

## Quick Fix Commands

```bash
# 1. Stop current container
docker-compose down

# 2. Build with no cache (ensure all changes applied)
docker-compose build --no-cache

# 3. Start the container
docker-compose up -d

# 4. Create test user
docker-compose exec app node scripts/create-test-user.js

# 5. Monitor logs
docker-compose logs -f app
```

## Public Deployment Options 🌐

### Option 1: Vercel (Recommended for Next.js) ⭐

**Pros**: Free tier, automatic SSL, global CDN, easy deployment
**Best for**: Production apps with good performance

1. **Prepare for Vercel**:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Deploy**:

   ```bash
   # Deploy to Vercel
   vercel

   # Follow prompts:
   # - Set up and deploy? Y
   # - Which scope? (choose your account)
   # - Link to existing project? N
   # - Project name: ambatu-rich
   # - Directory: ./
   # - Override settings? N
   ```

3. **Environment Variables** (Set in Vercel dashboard):
   ```
   DATABASE_URL=your_supabase_url
   DIRECT_URL=your_supabase_direct_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   OPENROUTER_API_KEY=your_openrouter_key
   OPENAI_API_KEY=your_openrouter_key
   ```

### Option 2: Railway 🚂

**Pros**: Docker support, PostgreSQL included, easy scaling
**Best for**: Docker deployments

1. **Setup**:

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Initialize
   railway init
   ```

2. **Deploy**:
   ```bash
   # Deploy with Docker
   railway up
   ```

### Option 3: Render 🎨

**Pros**: Free tier, automatic deployments, Docker support

1. **Connect GitHub**: Link your repository to Render
2. **Create Web Service**: Choose Docker deployment
3. **Set Environment Variables** in Render dashboard

### Option 4: DigitalOcean App Platform 🌊

**Pros**: Simple, scalable, good performance

1. **Connect Repository**: Link GitHub to DigitalOcean
2. **Choose App Platform**
3. **Select Docker deployment**

### Option 5: Self-Hosted VPS 💻

**For full control**, deploy on your own server:

```bash
# On your VPS
git clone your-repo
cd ambatu-rich
docker-compose up -d

# Setup reverse proxy (Nginx)
sudo apt install nginx certbot python3-certbot-nginx

# Configure domain and SSL
sudo certbot --nginx -d your-domain.com
```

## Recommended Deployment Steps 📋

### Step 1: Choose Platform

**Recommended**: Vercel (easiest) or Railway (Docker support)

### Step 2: Environment Setup

1. **Update Google OAuth**:

   - Add production domain to redirect URIs
   - Update `NEXTAUTH_URL` to production URL

2. **Database**:
   - Your Supabase is already configured ✅
   - Update connection strings if needed

### Step 3: Deploy

```bash
# For Vercel
vercel --prod

# For Railway
railway up

# For Docker on VPS
docker-compose up -d
```

### Step 4: Test Production

1. **Test authentication**: Google OAuth and credentials
2. **Test OCR**: Upload receipt images
3. **Test AI assistant**: Ask financial questions
4. **Monitor logs**: Check for errors

## Production Checklist ✅

- [ ] Environment variables set
- [ ] Google OAuth redirect URIs updated
- [ ] Database accessible from production
- [ ] SSL certificate configured
- [ ] Domain name pointing to deployment
- [ ] Error monitoring setup
- [ ] Backup strategy for database

## Monitoring & Debugging

```bash
# Check logs (adjust for your platform)
# Vercel: Check dashboard logs
# Railway: railway logs
# Docker: docker-compose logs -f app

# Test endpoints
curl https://your-domain.com/api/auth/session
curl https://your-domain.com/health # if you add health check

# Database health
# Check Supabase dashboard for connection stats
```

## Performance Optimization

1. **Enable caching** in production
2. **Optimize images** in public folder
3. **Monitor database** queries
4. **Set up CDN** for static assets
5. **Enable compression** in server config

## Security Considerations

1. **Environment variables**: Never commit secrets
2. **HTTPS only**: Redirect HTTP to HTTPS
3. **Rate limiting**: Add API rate limits
4. **CORS**: Configure for your domain only
5. **Database**: Use connection pooling

## Cost Estimates (Monthly)

- **Vercel**: Free tier (hobby), $20/month (pro)
- **Railway**: $5-20/month depending on usage
- **Render**: Free tier, $7/month (starter)
- **DigitalOcean**: $12-25/month
- **VPS**: $5-20/month + domain cost

## Next Steps After Deployment

1. **Custom Domain**: Configure your own domain
2. **Analytics**: Add Google Analytics or similar
3. **Error Tracking**: Add Sentry or similar
4. **Performance**: Monitor with tools like Lighthouse
5. **Backup**: Set up automated database backups
