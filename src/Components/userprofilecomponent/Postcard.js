import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

function PostCard({ post, currentUser, handleLike, toggleContent, expandedPostId }) {
  const isLiked = post.likedBy && post.likedBy.includes(currentUser?.uid);

  const getRandomGradient = () => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500'
    ];
    return gradients[post.id.charCodeAt(0) % gradients.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-7 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${getRandomGradient()} text-white flex items-center justify-center text-lg font-semibold shadow-inner`}>
              {post.username ? post.username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                {post.username}
              </h3>
              <p className="text-[12px] md:text-sm text-gray-500">
                {post.createdAt}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className={`relative ${expandedPostId === post.id ? '' : 'max-h-[150px] overflow-hidden'}`}>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
          {!expandedPostId === post.id && post.content.length > 150 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {post.content && post.content.length > 150 && (
          <button
            onClick={() => toggleContent(post.id)}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            {expandedPostId === post.id ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLike(post.id, isLiked)}
              className="flex items-center space-x-2 group"
            >
              <Heart
                size={20}
                className={`${isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-500 group-hover:text-red-500'
                  } transition-colors duration-200`}
              />
              <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'
                }`}>
                {post.likedBy ? post.likedBy.length : 0}
              </span>
            </button>

            <button className="flex items-center space-x-2 group">
              <MessageCircle
                size={20}
                className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 group-hover:text-blue-500">Comment</span>
            </button>

            <button className="flex items-center space-x-2 group">
              <Share2
                size={20}
                className="text-gray-500 group-hover:text-green-500 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 group-hover:text-green-500">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;