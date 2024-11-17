import { getAuth } from 'firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import PostsHeader from '../Components/Postscomponent/PostsHeader';
import { db } from '../config/Firebase/Firebaseconfiguration';
import Loader from '../Components/Loader/Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const auth = getAuth();

  useEffect(() => {

    setCurrentUser(auth.currentUser);
  }, [auth]);


  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  useEffect(() => {
    const postsCollectionRef = collection(db, 'posts');

    const unsubscribe = onSnapshot(postsCollectionRef, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      const shuffledPosts = shuffleArray(postsList);
      setPosts(postsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleLike = async (postId, isLiked) => {
    if (!currentUser) {
      console.error('No user is logged in!');
      return;
    }

    const postRef = doc(db, 'posts', postId);
    const userPostRef = doc(db, 'usersprofileposts', currentUser.email, 'postss', postId);

    try {
      if (isLiked) {

        console.log(`Unliking post ${postId}...`);
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUser.uid),
        });

        await updateDoc(userPostRef, {
          likedBy: arrayRemove(currentUser.uid),
        });
      } else {

        console.log(`Liking post ${postId}...`);
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUser.uid),
        });

        await updateDoc(userPostRef, {
          likedBy: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };


  const [expandedPostId, setExpandedPostId] = useState(null);

  const toggleContent = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };


  if (loading) {
    return <Loader />
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen w-screen">
      <PostsHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Posts</h1>

        {posts && (
          posts.map((post) => {
            const isLiked = post.likedBy && post.likedBy.includes(currentUser?.uid);

            return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md mb-6 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-semibold">
                      {post.username ? post.username[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{post.username}</p>
                      <p className="text-sm text-gray-500">{post.createdAt}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className={`text-gray-700 leading-relaxed whitespace-pre-wrap break-words ${expandedPostId !== post.id && 'line-clamp-3'
                      }`}
                  >
                    {post.content}
                  </div>

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

                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id, isLiked)}
                    className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${isLiked
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                  >
                    <ThumbsUp size={18} className="mr-2" />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  <span className="text-sm text-gray-600">
                    {post.likedBy ? post.likedBy.length : 0} Likes
                  </span>
                </div>
              </div>
            )
          })
        )
        }
      </div>
    </div>
  );
};

export default Posts;
