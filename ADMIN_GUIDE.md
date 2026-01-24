# Admin Panel Access

## Initial Setup

1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Create your admin account** by visiting:
   `http://localhost:3000/admin/login`

   Or use curl to register:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your@email.com",
       "password": "yourpassword",
       "name": "Your Name"
     }'
   ```

3. **Login** at: `http://localhost:3000/admin/login`

4. **Access Dashboard** at: `http://localhost:3000/admin/dashboard`

## Admin Panel Features

### Dashboard
- Overview statistics
- Quick actions
- Recent content

### Manage Experiences
- Add mentorship programs
- Add workshops
- Add achievements
- Edit/Delete existing experiences

### Manage Projects
- Add new projects
- Upload project images
- Set categories and technologies
- Mark projects as featured
- Edit/Delete projects

### Manage Blogs
- Write new blog posts
- Rich text editor for content
- Set categories and tags
- Mark blogs as featured
- Auto-generate slugs from titles
- View analytics (views, etc.)
- Edit/Delete blogs

## Important Notes

- **Default Credentials** (for testing only):
  - Email: `admin@electrophobia.com`
  - Password: `admin123`
  
- **Change these immediately in production!**

- All admin pages are protected and require login
- JWT tokens expire after 7 days
- MongoDB must be running for the backend to work

## Troubleshooting

**Can't login?**
- Ensure backend server is running on port 5000
- Check MongoDB is running
- Verify .env file is configured correctly

**Can't see data?**
- Login to admin panel
- Add content through the dashboard
- Data will appear on the public pages

## Security

- Never commit `.env` file to git
- Change default admin credentials
- Use strong passwords
- In production, disable the `/api/auth/register` endpoint after creating your admin account
