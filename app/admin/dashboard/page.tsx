'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { experienceAPI, projectAPI, blogAPI } from '@/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiLogOut, FiRefreshCw } from 'react-icons/fi';

interface Stats {
  experiences: number;
  projects: number;
  blogs: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ experiences: 0, projects: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'experiences' | 'projects' | 'blogs'>('experiences');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();

    // Refresh data when page becomes visible again (user returns from add/edit pages)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  const fetchStats = async () => {
    try {
      const [experiences, projects, blogs] = await Promise.all([
        experienceAPI.getAll(),
        projectAPI.getAll(),
        blogAPI.getAll(),
      ]);
      setStats({
        experiences: Array.isArray(experiences) ? experiences.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ experiences: 0, projects: 0, blogs: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">ElectroPhobia Admin</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStats}
                className="flex items-center gap-2 px-4 py-2 bg-[#22C0B3] hover:bg-[#1da89d] text-white rounded-lg transition-colors"
                title="Refresh data"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Experiences</h3>
            <p className="text-3xl font-bold text-[#22C0B3]">{stats.experiences}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-[#22C0B3]">{stats.projects}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Blogs</h3>
            <p className="text-3xl font-bold text-[#22C0B3]">{stats.blogs}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex gap-4 px-6 pt-4">
              {['experiences', 'projects', 'blogs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-gray-900 text-[#22C0B3] border-t border-x border-gray-700'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'experiences' && <ExperiencesTab onRefresh={fetchStats} />}
            {activeTab === 'projects' && <ProjectsTab onRefresh={fetchStats} />}
            {activeTab === 'blogs' && <BlogsTab onRefresh={fetchStats} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperiencesTab({ onRefresh }: { onRefresh?: () => void }) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceAPI.getAll();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    console.log('Deleting experience with ID:', id);
    
    try {
      const result = await experienceAPI.delete(id);
      console.log('Delete result:', result);
      setExperiences(experiences.filter(exp => exp._id !== id));
      if (onRefresh) onRefresh();
      alert('Experience deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      alert(`Failed to delete experience: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading experiences...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Manage Experiences</h2>
        <button
          onClick={() => router.push('/admin/experiences/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C0B3] hover:bg-[#1da89d] text-white rounded-lg transition-colors"
        >
          <FiPlus />
          Add New
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No experiences yet. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{exp.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{exp.type} • {exp.status}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/experiences/${exp._id}`)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsTab({ onRefresh }: { onRefresh?: () => void }) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('DELETE BUTTON CLICKED! ID:', id);
    
    const confirmDelete = window.confirm('⚠️ Are you sure you want to delete this project?\n\nThis action cannot be undone.');
    
    console.log('Confirmation result:', confirmDelete);
    
    if (!confirmDelete) {
      console.log('User cancelled deletion');
      return;
    }
    
    console.log('User confirmed - proceeding with deletion for ID:', id);
    
    try {
      const result = await projectAPI.delete(id);
      console.log('Delete result:', result);
      setProjects(projects.filter(proj => proj._id !== id));
      if (onRefresh) onRefresh();
      alert('✅ Project deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      alert(`❌ Failed to delete project: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Manage Projects</h2>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C0B3] hover:bg-[#1da89d] text-white rounded-lg transition-colors"
        >
          <FiPlus />
          Add New
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No projects yet. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{proj.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{proj.category} • {proj.status}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{proj.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/projects/${proj._id}`)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogsTab({ onRefresh }: { onRefresh?: () => void }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogAPI.getAll();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    console.log('Deleting blog with ID:', id);
    
    try {
      const result = await blogAPI.delete(id);
      console.log('Delete result:', result);
      setBlogs(blogs.filter(blog => blog._id !== id));
      if (onRefresh) onRefresh();
      alert('Blog deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      alert(`Failed to delete blog: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading blogs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Manage Blogs</h2>
        <button
          onClick={() => router.push('/admin/blogs/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C0B3] hover:bg-[#1da89d] text-white rounded-lg transition-colors"
        >
          <FiPlus />
          Add New
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No blogs yet. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{blog.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-2">{blog.excerpt}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/blogs/${blog._id}`)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
