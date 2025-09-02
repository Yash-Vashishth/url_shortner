'use client';

import { useState, useEffect } from 'react';

interface Url {
  id: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('/url');
      const data = await response.json();
      if (response.ok) {
        setUrls(data.urls);
      } else {
        setMessage(data.error || 'Failed to fetch URLs');
      }
    } catch (error) {
      setMessage('Failed to fetch URLs');
    }
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('URL shortened successfully!');
        setNewUrl('');
        fetchUrls(); // Refresh the list
      } else {
        setMessage(data.error || 'Failed to create short URL');
      }
    } catch (error) {
      setMessage('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage('Short URL copied to clipboard!');
  };

  const getShortUrl = (slug: string) => {
    return `${window.location.origin}/u/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">URL Shortener</h1>
            
            {/* Add New URL Form */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shorten a new URL</h2>
              <form onSubmit={handleAddUrl} className="space-y-4">
                <div>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Enter URL to shorten (e.g., https://example.com)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Shorten URL'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('successfully') || message.includes('copied') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* URLs Table */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Shortened URLs</h2>
              {urls.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No URLs created yet. Create your first shortened URL above!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Original URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Short URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {urls.map((url) => (
                        <tr key={url.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={url.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 truncate max-w-xs block"
                              title={url.url}
                            >
                              {url.url.length > 50 ? `${url.url.substring(0, 50)}...` : url.url}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {getShortUrl(url.slug)}
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => copyToClipboard(getShortUrl(url.slug))}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Copy
                            </button>
                            <a
                              href={getShortUrl(url.slug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                            >
                              Visit
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}