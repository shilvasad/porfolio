import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogPostPage.scss';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${slug}`);
        setPost(data);
      } catch (err) {
        setError('Failed to load the blog post. It may not exist or has not been published.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="loader">Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="blog-post-container">
      {post && (
        <article>
          <h1>{post.title}</h1>
          <p className="post-meta">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}>
            {/* Using dangerouslySetInnerHTML assuming content is sanitized on the server
                or is trusted (e.g., from a markdown editor).
                For a production app, use a library like DOMPurify. */}
          </div>
        </article>
      )}
    </div>
  );
};

export default BlogPostPage;
