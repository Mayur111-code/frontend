import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

// Dev.to Public Articles Endpoint - No API Key needed for basic article list
const DEV_TO_API_URL = 'https://dev.to/api/articles?per_page=10&top=1'; 
// 'top=1' fetches the top articles for the past day (trending)

// --- DUMMY DEV.TO ARTICLE DATA (For Immediate Fallback/Testing) ---
const DUMMY_DEV_ARTICLES = [
  {
    id: 1,
    title: "10 React Hooks You Should Know for 2026",
    description: "A deep dive into custom hooks, performance optimization, and the latest React features.",
    url: "https://dev.to/example/react-hooks",
    cover_image: "https://dummyimage.com/600x250/3498db/fff&text=React+Hooks",
    tag_list: ["react", "javascript", "webdev"],
    public_reactions_count: 520, // Likes
    comments_count: 45,
    user: {
      name: "Alice Developer",
      profile_image: "https://dummyimage.com/50x50/e74c3c/fff&text=AD",
      username: "alicedev",
    },
    published_timestamp: "2025-11-20T12:00:00Z",
  },
  {
    id: 2,
    title: "Understanding CSS Grid Layouts in 5 Minutes",
    description: "Mastering the basics of CSS Grid to build modern, responsive interfaces easily.",
    url: "https://dev.to/example/css-grid",
    cover_image: null, // Dev.to allows posts without a cover image
    tag_list: ["css", "frontend", "tutorial"],
    public_reactions_count: 125,
    comments_count: 12,
    user: {
      name: "Bob Frontend",
      profile_image: "https://dummyimage.com/50x50/2ecc71/fff&text=BF",
      username: "bobfrontend",
    },
    published_timestamp: "2025-11-19T10:30:00Z",
  },
];


function DevCommunityFeed() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(DEV_TO_API_URL);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}. Could not fetch articles.`);
        }

        const data = await response.json();
        // Only take articles that have a title and user info
        setArticles(data.filter(a => a.title && a.user) || []); 
        setError(null);

      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(`Failed to fetch live Dev.to articles. Showing fallback data.`);
        setArticles(DUMMY_DEV_ARTICLES); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []); 

  // --- STYLES FOR DEV.TO LOOK ---

  const styles = {
    // Main Feed Container (Dev.to width and background)
    container: {
      maxWidth: '850px',
      margin: '0 auto',
      padding: '20px 15px',
      backgroundColor: '#f0f0f0', // Light grey background
      minHeight: '100vh',
    },
    // Article Card (White background, light shadow, rounded corners)
    articleCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '10px',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
      // Hover effect is difficult with inline styles, but essential for UX.
    },
    // Article Content Area Padding
    contentArea: {
        padding: '16px',
    },
    // Cover Image Style
    coverImage: {
      width: '100%',
      maxHeight: '200px',
      objectFit: 'cover',
      borderRadius: '8px 8px 0 0', // Rounded top corners only
    },
    // User Info (Profile Pic and Name)
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    profileImage: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginRight: '8px',
      objectFit: 'cover',
    },
    metaText: {
        fontSize: '0.85em',
        color: '#717171',
    },
    // Post Title (Bold and clear)
    title: {
      fontSize: '1.5em',
      fontWeight: '700',
      color: '#090909',
      lineHeight: '1.3',
      marginBottom: '10px',
    },
    // Tags
    tagContainer: {
        marginBottom: '10px',
        display: 'flex',
        flexWrap: 'wrap',
    },
    tag: {
      fontSize: '0.8em',
      color: '#3b49df', // Dev.to-like primary color
      marginRight: '8px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#f2f5ff', // Very light blue background
      cursor: 'pointer',
    },
    // Engagement Metrics (Likes/Comments)
    metrics: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: '1px solid #e5e5e5',
        fontSize: '0.85em',
        color: '#575757',
    },
    metricItem: {
        display: 'flex',
        alignItems: 'center',
    }
  };

  // Function to format the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- CONDITIONAL RENDERING ---

  if (isLoading) {
    return <div style={styles.container}><h2 style={{ textAlign: 'center' }}>⚙️ Fetching Trending Dev Posts...</h2></div>;
  }

  if (articles.length === 0) {
    return <div style={styles.container}><h2 style={{ textAlign: 'center' }}>No articles found. Try again later.</h2></div>;
  }
  
  // --- RENDER DEV.TO FEED ---

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px', color: '#090909' }}>Dev Community - Trending Today</h1>
      {error && 
        <div style={{ color: '#c05717', padding: '10px', border: '1px solid #ffe4c4', backgroundColor: '#fff4e5', borderRadius: '4px', marginBottom: '15px' }}>
          ⚠️ {error}
        </div>
      }



<Navbar/>

      {articles.map((article) => (
        <a 
            key={article.id} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
        >
          <div style={styles.articleCard}>
            {/* 1. Cover Image */}
            {article.cover_image && 
              <img src={article.cover_image} alt={article.title} style={styles.coverImage} />
            }

            <div style={styles.contentArea}>
              {/* 2. User Info */}
              <div style={styles.userInfo}>
                <img src={article.user.profile_image} alt={article.user.name} style={styles.profileImage} />
                <div>
                    <div style={{ fontWeight: '600', color: '#090909', fontSize: '0.9em' }}>{article.user.name}</div>
                    <div style={styles.metaText}>Published on {formatTime(article.published_timestamp)}</div>
                </div>
              </div>

              {/* 3. Title */}
              <div style={styles.title}>{article.title}</div>

              {/* 4. Tags */}
              <div style={styles.tagContainer}>
                {article.tag_list.slice(0, 4).map(tag => ( // Limit to 4 tags
                  <div key={tag} style={styles.tag}>#{tag}</div>
                ))}
              </div>

              {/* 5. Engagement Metrics (Likes and Comments) */}
              <div style={styles.metrics}>
                <div style={styles.metricItem}>
                    {/* Heart icon (using a simple emoji as a placeholder) */}
                    <span role="img" aria-label="reactions" style={{ marginRight: '4px' }}>💖</span>
                    {article.public_reactions_count} Reactions
                </div>
                <div style={styles.metricItem}>
                    {/* Comment icon */}
                    <span role="img" aria-label="comments" style={{ marginRight: '4px' }}>💬</span>
                    {article.comments_count} Comments
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default DevCommunityFeed;