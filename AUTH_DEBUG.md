# Authentication Debug Guide

## Common Issues & Solutions

### 1. Google OAuth Redirect URI Issue ⚠️

**Problem**: When using `NEXTAUTH_URL=http://localhost:3000`, Google OAuth won't work unless configured properly.

**Solution**: Update Google OAuth Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 2. Database Connection Issues 🔌

**Check Database Connection**:

```bash
# Test database connection from Docker container
docker-compose exec app npx prisma db push --preview-feature
```

### 3. Environment Variables Check ✅

Ensure these are set in `docker-compose.yml`:

- `DATABASE_URL` ✓
- `DIRECT_URL` ✓
- `NEXTAUTH_SECRET` ✓
- `NEXTAUTH_URL` ✓
- `GOOGLE_CLIENT_ID` ✓
- `GOOGLE_CLIENT_SECRET` ✓

### 4. Debug Steps 🔍

1. **Check if users exist in database**:

   ```bash
   docker-compose exec app npx prisma studio
   ```

2. **View authentication logs**:

   ```bash
   docker-compose logs -f app | grep -E "🔐|❌|✅|💥|👤|🚪"
   ```

3. **Test credentials login**:

   - Create a test user in the database first
   - Use email/username and password to sign in

4. **Test Google OAuth**:
   - Make sure redirect URI is configured
   - Check if Google client ID/secret are correct

### 5. Quick Fixes 🚀

**Create a test user manually**:

```sql
-- Run this in Prisma Studio or database console
INSERT INTO "user" (id, email, password, name, username)
VALUES (
  'test-user-id',
  'test@example.com',
  '$2a$10$hashOfPassword123', -- You need to hash this properly
  'Test User',
  'testuser'
);
```

**Reset authentication state**:

```bash
# Clear browser cookies and try again
# Or use incognito mode
```

### 6. Container Restart 🔄

If changes don't take effect:

```bash
docker-compose down
docker-compose up --build
```

## Troubleshooting Commands

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs app

# Access container shell
docker-compose exec app sh

# Check environment variables in container
docker-compose exec app env | grep -E "NEXTAUTH|GOOGLE|DATABASE"

# Test database connection
docker-compose exec app npx prisma db push

# Generate Prisma client
docker-compose exec app npx prisma generate
```

## Expected Debug Output

When authentication is working, you should see logs like:

```
🔐 Credentials auth attempt: { emailOrUsername: 'user@example.com' }
📧 Is email? true
👤 User found: Yes
🔑 Password valid: true
✅ Authentication successful for user: user@example.com
🎫 Session callback: { session: true, token: true }
```

If you see `❌` or `💥` messages, those indicate the specific problem area.
