import { Home, Menu, Plus, User, Users, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AddPostPopup from './AddPostPopup';

const PostsHeader = ({ username }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open sidebar</span>
              {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            <button
              onClick={() => setShowAddPostModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-transparent"
            >
              <Plus className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Add Post</span>
            </button>
          </div>
        </div>

        <AddPostPopup
          visible={showAddPostModal}
          onCancel={() => setShowAddPostModal(false)}
        />
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out z-30 ${showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-center h-16 bg-blue-800">
          <h2 className="text-2xl font-bold text-white">{username}</h2>
        </div>
        <nav className="mt-5">
          <a href="#" className="flex items-center px-6 py-2 text-white hover:bg-blue-600">
            <Home className="mr-3" size={20} />
            Home
          </a>
          <a href="#" className="flex items-center px-6 py-2 text-white hover:bg-blue-600">
            <User className="mr-3" size={20} />
            Profile
          </a>
          <a href="#" className="flex items-center px-6 py-2 text-white hover:bg-blue-600">
            <Users className="mr-3" size={20} />
            Users
          </a>
        </nav>
      </div>
    </>
  );
};

export default PostsHeader;
