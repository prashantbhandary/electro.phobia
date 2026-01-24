# 🔒 Security Best Practices

## Environment Variables

### ⚠️ NEVER Commit These Files:
- `.env`
- `.env.local`
- `.env.production`
- `.env.local.secure`
- Any file containing real credentials

### ✅ Safe to Commit:
- `.env.example`
- `.env.local.example`

## Credential Management

### Local Development
1. Copy `.env.example` to `.env.local`
2. Fill in your local credentials
3. Never commit `.env.local`

### Production Deployment

#### Vercel (Frontend)
Set environment variables in Vercel Dashboard:
- Project Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

#### Render (Backend)
Set environment variables in Render Dashboard:
- Service → Environment
- Add all variables from `.env.example`:
  - `PORT`
  - `MONGODB_URI`
  - `JWT_SECRET` (use a strong random string)
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://your-frontend.vercel.app`

## Security Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] No credentials in code files
- [ ] No credentials in README files
- [ ] Strong JWT secret (min 32 characters, random)
- [ ] Strong MongoDB password
- [ ] MongoDB network access restricted to specific IPs
- [ ] Admin credentials changed from defaults
- [ ] Environment variables set in hosting platforms
- [ ] Regular security audits

## Generate Secure Secrets

### JWT Secret (Node.js)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT Secret (PowerShell)
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

## MongoDB Security

1. **Strong Password**: Use complex passwords (letters, numbers, symbols)
2. **Network Access**: Restrict to specific IPs or use VPN
3. **Database User Permissions**: Create separate users for different environments
4. **Connection String**: Never expose in client-side code

## What to Do If Credentials Are Exposed

1. **Immediately** rotate all exposed credentials
2. Change MongoDB password
3. Generate new JWT secret
4. Update environment variables in all platforms
5. Check git history and remove sensitive commits
6. Review access logs for unauthorized access
