import React, { useEffect, useState } from 'react';
import { db } from '../config/Firebase/Firebaseconfiguration';
import { doc, getDoc, collection, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import ProfileHeader from '../Components/userprofilecomponent/Profileheader';
import PostCard from '../Components/userprofilecomponent/Postcard';
import { ArrowLeft } from 'lucide-react';
import { Button } from 'antd';
import Loader from '../Components/Loader/Loader';

function Userprofile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, 'users', id);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);


  useEffect(() => {
    setCurrentUser(auth.currentUser);

    const fetchUserPosts = () => {
      try {
        if (userData?.email) {
          const postsCollection = collection(db, 'usersprofileposts', userData.email, 'postss');

          const unsubscribe = onSnapshot(postsCollection, (postSnapshot) => {
            const postsList = postSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserPosts(postsList);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.email) {
      fetchUserPosts();
    }
  }, [userData, auth]);


  const handleLike = async (postId, isLiked) => {
    const globalPostRef = doc(db, 'posts', postId);
    const userProfilePostRef = doc(db, 'usersprofileposts', userData.email, 'postss', postId);

    try {
      if (isLiked) {

        await updateDoc(globalPostRef, {
          likedBy: arrayRemove(currentUser.uid),
        });


        await updateDoc(userProfilePostRef, {
          likedBy: arrayRemove(currentUser.uid),
        });


        await updateDoc(doc(db, 'users', userData.email), {
          likedPosts: arrayRemove(postId),
        });

      } else {

        await updateDoc(globalPostRef, {
          likedBy: arrayUnion(currentUser.uid),
        });


        await updateDoc(userProfilePostRef, {
          likedBy: arrayUnion(currentUser.uid),
        });


        await updateDoc(doc(db, 'users', userData.email), {
          likedPosts: arrayUnion(postId),
        });
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const toggleContent = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen w-screen p-8 md:pl-72">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeft className="group-hover:-translate-x-2 transition duration-300" />}
            onClick={() => navigate('/Allprofile')}
            className="flex items-center text-gray-600 hover:text-gray-900 group"
          >
            Back to All Profiles
          </Button>
        </div>

        {/* Profile Header */}
        {userData && <ProfileHeader userData={userData} navigate={navigate} />}

        {/* Posts Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Posts</h3>

          {userPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No posts available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  handleLike={handleLike}
                  toggleContent={toggleContent}
                  expandedPostId={expandedPostId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Userprofile;
