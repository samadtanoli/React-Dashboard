import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/Firebase/Firebaseconfiguration';
import { Modal, message } from 'antd';
import { Edit2, Trash2, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import Loader from '../Components/Loader/Loader';

const Yourprofile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [showLikesDropdown, setShowLikesDropdown] = useState({});
  const [likedUsers, setLikedUsers] = useState({});

  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail) return;

      try {
        const userRef = doc(db, 'users', auth.currentUser?.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserPosts = async () => {
      if (!userEmail) return;

      try {
        const userPostsRef = doc(db, 'usersprofileposts', userEmail);
        const postsCollection = collection(userPostsRef, 'postss');
        const querySnapshot = await getDocs(postsCollection);

        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserPosts();
    // setLoading(false);
  }, [userEmail]);

  const handleEditPost = (postId, content) => {
    setEditingPostId(postId);
    setNewContent(content);
  };

  const handleSaveEdit = async () => {
    if (!newContent.trim()) return;

    try {
      const postRef = doc(db, 'usersprofileposts', userEmail, 'postss', editingPostId);
      await updateDoc(postRef, { content: newContent });

      const mainPostRef = doc(db, 'posts', editingPostId);
      await updateDoc(mainPostRef, { content: newContent });

      setUserPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === editingPostId ? { ...post, content: newContent } : post
        )
      );

      setEditingPostId(null);
      setNewContent("");
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const postRef = doc(db, 'usersprofileposts', userEmail, 'postss', postIdToDelete);
      await deleteDoc(postRef);

      const mainPostRef = doc(db, 'posts', postIdToDelete);
      await deleteDoc(mainPostRef);

      setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postIdToDelete));

      setShowDeleteModal(false);
      setPostIdToDelete(null);
      message.success('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleContent = (postId) => {
    setExpandedPostId(prev => (prev === postId ? null : postId));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Invalid Date';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  const toggleLikesDropdown = (postId) => {
    setShowLikesDropdown((prev) => ({ ...prev, [postId]: !prev[postId] }));
    fetchLikedUsers(postId);
  };

  const fetchLikedUsers = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const likedByUids = postDoc.data()?.likedBy || [];

      const users = {};
      for (const uid of likedByUids) {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          users[uid] = userDoc.data().username;
        }
      }
      setLikedUsers((prev) => ({ ...prev, [postId]: users }));
    } catch (error) {
      console.error('Error fetching liked users:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen w-screen p-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-xl p-6 mb-8 md:ml-64">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-inner overflow-hidden flex items-center justify-center">
            {userData?.profilePicture ? (
              <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-blue-600">
                {userData?.username?.[0]?.toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{userData?.username || 'No Username'}</h2>
            <p className="text-blue-100">{userData?.email || 'No email available'}</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {userData?.profilePicture ? (
                      <img src={userData.profilePicture} alt="Profile" className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-xl font-semibold text-blue-600">{userData?.username?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{userData?.username || 'Anonymous'}</p>
                    <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-gray-700 leading-relaxed whitespace-pre-wrap break-words ${expandedPostId !== post.id && 'line-clamp-3'
                    }`}>
                    {post.content || 'No content available.'}
                  </p>
                  {post.content && post.content.length > 150 && (
                    <button
                      onClick={() => toggleContent(post.id)}
                      className="mt-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                    >
                      <span className="mr-1">
                        {expandedPostId === post.id ? 'See Less' : 'See More'}
                      </span>
                      {expandedPostId === post.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post.id, post.content)}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => { setShowDeleteModal(true); setPostIdToDelete(post.id); }}
                      className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleLikesDropdown(post.id)}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      {post.likedBy?.length || 0} Like{post.likedBy?.length !== 1 && 's'}
                    </button>
                    {showLikesDropdown[post.id] && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Liked by:</h4>
                        {likedUsers[post.id] ? (
                          likedUsers[post.id].map((username, index) => (
                            <p key={index} className="text-sm text-gray-600 py-1">{username}</p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Loading...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You have no posts yet.</p>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        title="Confirm Deletion"
        open={showDeleteModal}
        onOk={() => {
          handleDeletePost(postIdToDelete);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </div>
  );
};

export default Yourprofile;
