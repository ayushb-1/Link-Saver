import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './Bookmarks.css';

const BookmarkItem = ({ bookmark, deleteBookmark }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Format the date
  const formattedDate = formatDistanceToNow(
    new Date(bookmark.createdAt),
    { addSuffix: true }
  );
  
  // Get domain from URL
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch (error) {
      return url;
    }
  };
  
  const handleDeleteClick = () => {
    if (confirming) {
      deleteBookmark(bookmark._id);
    } else {
      setConfirming(true);
      
      // Auto-reset confirming state after 3 seconds
      setTimeout(() => {
        setConfirming(false);
      }, 3000);
    }
  };
  
  return (
    <div className="bookmark-item">
      <div className="bookmark-header">
        <div className="bookmark-favicon">
          <img 
            src={bookmark.favicon} 
            alt="" 
            onError={(e) => {e.target.src = '/favicon.ico'}}
          />
        </div>
        
        <div className="bookmark-info">
          <h3 className="bookmark-title">
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {bookmark.title}
            </a>
          </h3>
          <p className="bookmark-meta">
            <span className="bookmark-domain">
              {getDomain(bookmark.url)}
            </span>
            <span className="bookmark-date">
              {formattedDate}
            </span>
          </p>
        </div>
        
        <div className="bookmark-actions">
          <button
            className="btn btn-sm btn-icon btn-secondary"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse summary" : "Expand summary"}
          >
            {expanded ? '▲' : '▼'}
          </button>
          
          <button
            className={`btn btn-sm btn-icon ${confirming ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleDeleteClick}
            aria-label={confirming ? "Confirm delete" : "Delete bookmark"}
          >
            {confirming ? '✓' : '✕'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="bookmark-summary">
          <h4>Summary</h4>
          <p>{bookmark.summary}</p>
          <div className="bookmark-visit">
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              Visit Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkItem;