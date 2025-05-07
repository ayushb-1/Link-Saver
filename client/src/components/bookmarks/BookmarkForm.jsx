import React, { useState } from 'react';
import './Bookmarks.css';

const BookmarkForm = ({ addBookmark, loading }) => {
  const [url, setUrl] = useState('');
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!url) {
      return;
    }
    
    // Check if URL has http/https, if not add it
    let validUrl = url;
    if (!url.match(/^https?:\/\//i)) {
      validUrl = `https://${url}`;
    }
    
    const success = await addBookmark(validUrl);
    
    if (success) {
      setUrl('');
    }
  };
  
  return (
    <div className="bookmark-form-container">
      <form onSubmit={submitHandler} className="bookmark-form">
        <div className="form-input-group">
          <input
            type="text"
            className="form-control"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any URL to save and summarize"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !url}
          >
            {loading ? <span className="loading-spinner"></span> : 'Save'}
            
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkForm;