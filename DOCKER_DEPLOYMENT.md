# Docker Deployment Guide for AmbatuRich

## Prerequisites

- Docker and Docker Compose installed on your system
- Supabase database setup (you're already using this)
- Environment variables configured

## Quick Start

1. **Build and run the application:**

   ```bash
   docker-compose up --build
   ```

2. **Run in background:**

   ```bash
   docker-compose up --build -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

## Environment Variables

Make sure the following environment variables are properly set in your `docker-compose.yml`:

### Required Variables:

- `DATABASE_URL` - Your Supabase database URL with pgbouncer
- `DIRECT_URL` - Your Supabase direct database URL
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Your application URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `OPENROUTER_API_KEY` - OpenRouter API key

### For Production Deployment:

1. **Update NEXTAUTH_URL:**

   ```yaml
   - NEXTAUTH_URL=https://yourdomain.com
   ```

2. **Update Google OAuth redirect URIs** in Google Console to include your production domain

3. **Use HTTPS** in production with a reverse proxy like Nginx

## Docker Commands

### Basic Operations:

```bash
# Stop services
docker-compose down

# Rebuild specific service
docker-compose build app

# Execute commands in running container
docker-compose exec app sh

# View container status
docker-compose ps
```

### Database Operations:

```bash
# Run Prisma migrations (if needed)
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate

# Open Prisma Studio
docker-compose exec app npx prisma studio
```

## Production Deployment

For production, consider:

1. **Use a reverse proxy** (Nginx) for HTTPS
2. **Set up proper logging** and monitoring
3. **Use Docker secrets** for sensitive environment variables
4. **Set up backup strategies** for your Supabase database
5. **Configure health checks**

## Troubleshooting

### Common Issues:

1. **Prisma Schema Error:**

   - Make sure the `prisma/` directory is included in the Docker build context
   - Check that `schema.prisma` exists in the prisma directory

2. **Database Connection Issues:**

   - Verify your Supabase connection strings
   - Check network connectivity to Supabase

3. **Build Failures:**
   - Clear Docker cache: `docker system prune -a`
   - Check for sufficient disk space

### Logs:

```bash
# View application logs
docker-compose logs app

# Follow logs in real-time
docker-compose logs -f app
```

## Security Notes

- Never commit real environment variables to version control
- Use Docker secrets for production deployments
- Regularly update base images and dependencies
- Configure proper firewall rules for production
