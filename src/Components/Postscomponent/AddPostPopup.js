import React, { useState, useEffect } from 'react';
import { Modal, Input, message } from 'antd';
import { db, auth } from '../../config/Firebase/Firebaseconfiguration';
import { collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const AddPostPopup = ({ visible, onCancel }) => {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userDataLoading, setUserDataLoading] = useState(true);

  const getFormattedDate = () => {
    const date = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        message.error('You must be logged in to post');
        setUserDataLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          message.error('User data not found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Failed to fetch user data');
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSavePost = async () => {
    if (!postContent.trim()) {
      message.error('Post content cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        message.error('You must be logged in to post');
        setLoading(false);
        return;
      }

      const newPostId = doc(collection(db, 'posts')).id;

      const postData = {
        username: username,
        email: user.email,
        uid: user.uid,
        content: postContent,
        timestamp: serverTimestamp(),
        createdAt: getFormattedDate(),
      };

      const postsCollectionRef = doc(db, 'posts', newPostId);
      await setDoc(postsCollectionRef, postData);

      const userProfilePostRef = doc(db, 'usersprofileposts', user.email);
      const userPostsSubcollectionRef = doc(userProfilePostRef, 'postss', newPostId);
      await setDoc(userPostsSubcollectionRef, postData);

      message.success('Post added successfully');
      onCancel();
    } catch (error) {
      console.error('Error adding post:', error);
      message.error('Failed to add post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add a Post"
      open={visible}
      onCancel={onCancel}
      onOk={handleSavePost}
      okText={loading ? 'Saving...' : 'Save'}
      okButtonProps={{ loading: loading, disabled: userDataLoading }}
      cancelButtonProps={{ disabled: loading }}
    >
      {userDataLoading ? (
        <div className="text-center py-4">Loading user data...</div>
      ) : (
        <Input.TextArea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write something..."
          autoSize={{ minRows: 4, maxRows: 8 }}
          className="mb-4"
        />
      )}
    </Modal>
  );
};

export default AddPostPopup;