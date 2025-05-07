import React from 'react';
import BookmarkItem from './BookmarkItem';
import './Bookmarks.css';

const BookmarkList = ({ bookmarks, loading, deleteBookmark }) => {
  console.log("bookmarks",bookmarks)
  if (loading) {
    return (
      <div className="bookmarks-loading">
        <div className="loading-spinner"></div>
        <p>Loading your bookmarks...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    console.log("here")
    return (
      <div className="bookmarks-empty">
        <div className="empty-icon">📚</div>
        <h3>No bookmarks yet</h3>
        <p>Add your first bookmark using the form above</p>
      </div>
    );
  }

  return (
    <div className="bookmark-list">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark._id}
          bookmark={bookmark}
          deleteBookmark={deleteBookmark}
        />
      ))}
    </div>
  );
};

export default BookmarkList;