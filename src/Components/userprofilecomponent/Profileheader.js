import React from 'react';

function ProfileHeader({ userData, navigate }) {
  return (
    <div className="flex items-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-xl p-6 mb-8 gap-4">
      <div className="w-10 h-10 md:w-20 md:h-20 border-2 shadow-2xl border-white rounded-full flex items-center justify-center">
        {userData?.profilePicture ? (
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        ) : (
          <span className="text-[16px] md:text-3xl text-white">
            {userData?.username?.[0]?.toUpperCase() || 'A'}
          </span>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {userData?.username || 'No Username'}
        </h2>
        <p className="text-[15px] text-white">{userData?.email || 'No email available'}</p>
        <p className="text-gray-200 text-[13px] md:text-[16px]">
          {userData?.createdAt
            ? `Joined on ${userData.createdAt.toDate().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}`
            : 'Account creation date not available.'}
        </p>
      </div>
    </div>
  );
}

export default ProfileHeader;
