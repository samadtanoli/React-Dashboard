import React, { useState, useEffect } from 'react';
import { db } from '../config/Firebase/Firebaseconfiguration';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import Loader from '../Components/Loader/Loader';

function Allprofile() {
  const [users, setUsers] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const toggleHover = (userId) => {
    setHoveredUser((prev) => (prev === userId ? null : userId));
  };

  const isUserNew = (newUserExpiresAt) => {
    const now = new Date();
    const expirationDate = newUserExpiresAt?.toDate();
    return expirationDate && now < expirationDate;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen w-screen p-8 md:pl-72">
      <div className="max-w-7xl mx-auto md:pl-4">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
            <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
              {users.length} Users
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <Link
              to={`/Userprofile/${user.id}`}
              key={user.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg ${hoveredUser === user.id ? 'scale-105' : ''
                }`}
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      {user.username ? (
                        <span className="text-xl font-bold">{user.username[0].toUpperCase()}</span>
                      ) : (
                        <UserCircle size={24} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    {isUserNew(user.newUserExpiresAt) && (
                      <p className="text-xs font-medium text-green-600">New member</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Allprofile;
