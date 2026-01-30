'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productAPI } from '@/lib/api';
import MarkdownEditor from '@/components/MarkdownEditor';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/lib/useToast';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: 'PCB',
    price: '',
    description: '',
    imageUrl: '',
    stock: '0',
    featured: false,
    isPublished: true,
  });

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const data = await productAPI.getById(params.id as string);
      setFormData({
        ...data,
        price: data.price.toString(),
        stock: data.stock.toString(),
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await productAPI.update(params.id as string, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      showToast('Product updated successfully!', 'success');
      setTimeout(() => router.push('/admin/dashboard'), 1500);
    } catch (error: any) {
      console.error('Error updating product:', error);
      showToast(`Failed to update product: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Loading product" size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
      <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22C0B3] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22C0B3] focus:border-transparent"
              >
                <option value="PCB">PCB</option>
                <option value="Kit">Kit</option>
                <option value="Module">Module</option>
                <option value="Component">Component</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (NPR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22C0B3] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22C0B3] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description (Markdown supported)</label>
            {!loading && formData.description !== undefined && (
              <MarkdownEditor
                key={`product-${params.id}`}
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Write your product description in markdown..."
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22C0B3] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-[#22C0B3] bg-gray-700 border-gray-600 rounded focus:ring-[#22C0B3]"
              />
              <label className="ml-2 text-sm text-gray-300">Featured product</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 text-[#22C0B3] bg-gray-700 border-gray-600 rounded focus:ring-[#22C0B3]"
              />
              <label className="ml-2 text-sm text-gray-300">Published</label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-[#22C0B3] hover:bg-[#1da89d] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
