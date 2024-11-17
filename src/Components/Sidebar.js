import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Home, LogOut, Menu, Users, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRightToLine } from 'lucide-react';

export default function Sidebar({ username, setShowEditPopup, setShowLogoutPopup, loading, shouldRedirect }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const sidebarRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/Home')
    }
  }, [navigate, shouldRedirect])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeSidebar = () => {
    setShowSidebar(false)
  }

  return (
    <div>
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100 transition-colors duration-200"
        aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
      >
        {showSidebar ? <ChevronLeft size={24} /> : <Menu size={24} />}
      </button>

      <div
        ref={sidebarRef}
        className={`fixed h-screen bg-gradient-to-b from-blue-600 to-blue-800 w-[280px] transform top-0 left-0 transition-transform duration-300 ease-in-out z-40 ${showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 shadow-2xl`}
      >
        <div className="h-full flex flex-col">
          <div className="flex flex-col items-center justify-center py-8 border-b border-blue-500">
            <div className="relative w-24 h-24 mb-4 rounded-full bg-white shadow-inner overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : username && username !== 'No Username' ? (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600">
                  {username[0].toUpperCase()}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-blue-600">+</div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {loading ? 'Loading...' : username || 'No Username'}
            </h2>
            <button
              onClick={() => {
                setShowEditPopup(true)
                closeSidebar()
              }}
              className="text-sm text-blue-100 px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 transition-colors duration-200"
            >
              Edit Profile
            </button>
          </div>

          <nav className="flex-grow py-6">
            <Link
              to="/Home"
              className="group flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
              onClick={closeSidebar}
            >
              <Home className="mr-3" size={20} />
              <span className='flex items-center justify-between'>Home <ArrowRightToLine className="group-hover:translate-x-2 group-hover:opacity-100 transition duration-300 opacity-0 h-5" /></span>
            </Link>
            <Link
              to="/Yourprofile"
              className="group flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
              onClick={closeSidebar}
            >
              <User className="mr-3" size={20} />
              <span className='flex items-center justify-between'>Profile <ArrowRightToLine className="group-hover:translate-x-2 group-hover:opacity-100 transition duration-300 opacity-0 h-5" /></span>
            </Link>
            <Link
              to="/Allprofile"
              className="group flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
              onClick={closeSidebar}
            >
              <Users className="mr-3" size={20} />
              <span className='flex items-center justify-between'>Users <ArrowRightToLine className="group-hover:translate-x-2 group-hover:opacity-100 transition duration-300 opacity-0 h-5" /></span>
            </Link>
          </nav>

          <div className="p-6 border-t border-blue-500">
            <button
              onClick={() => {
                setShowLogoutPopup(true)
                closeSidebar()
              }}
              className="flex items-center justify-center w-full px-4 py-2 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <LogOut className="mr-2" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}