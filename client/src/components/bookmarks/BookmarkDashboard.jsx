import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BookmarkForm from './BookmarkForm';
import BookmarkList from './BookmarkList';
import './Bookmarks.css';

const BookmarkDashboard = ({ userInfo }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingBookmark, setAddingBookmark] = useState(false);
  
  // Fetch bookmarks on component mount
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  // Function to fetch all bookmarks
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get('https://link-saver-l8wb.onrender.com/api/bookmarks/getbookmarks', config);
      console.log("data", data)
      setBookmarks(data);
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch bookmarks'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add a new bookmark
  const addBookmark = async (url) => {
    try {
      setAddingBookmark(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.post('https://link-saver-l8wb.onrender.com/api/bookmarks/createbookmark', { url }, config);
      
      // Add the new bookmark to the beginning of the list
      setBookmarks([data, ...bookmarks]);
      toast.success('Bookmark added successfully');
      return true;
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to add bookmark'
      );
      return false;
    } finally {
      setAddingBookmark(false);
    }
  };
  
  // Function to delete a bookmark
  const deleteBookmark = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.delete(`https://link-saver-l8wb.onrender.com/api/bookmarks/deletebookmark/${id}`, config);
      
      // Update bookmarks list after successful deletion
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
      toast.success('Bookmark deleted');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete bookmark'
      );
    }
  };
  
  return (
    <div className="bookmarks-dashboard">
      <h1 className="dashboard-title">Your Bookmarks</h1>
      
      <BookmarkForm 
        addBookmark={addBookmark} 
        loading={addingBookmark} 
      />
      
      <BookmarkList 
        bookmarks={bookmarks} 
        loading={loading} 
        deleteBookmark={deleteBookmark} 
      />
    </div>
  );
};

export default BookmarkDashboard;