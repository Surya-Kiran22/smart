import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { user, accounts, logout, switchToAccount } = useAuth()
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-3xl">🎓</span>
              <span className="ml-2">CampusBid</span>
            </Link>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-2">Student Marketplace</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  🏠 Browse
                </Link>
                <Link to="/watchlist" className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  ⭐ Watchlist
                </Link>
                <Link to="/bidding-history" className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  📊 My Bids
                </Link>
                <Link to="/seller-history" className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  💰 My Sales
                </Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  📋 Dashboard
                </Link>
                <Link to="/create-item" className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition text-sm font-semibold">
                  ➕ Sell Item
                </Link>
                <div className="w-px h-6 bg-white/30 mx-2"></div>
                
                {/* Account Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full border-2 border-white/50" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                    {accounts.length > 1 && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{accounts.length}</span>
                    )}
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">Switch Account</p>
                      </div>
                      {accounts.map((account) => (
                        <button
                          key={account.user.id}
                          onClick={() => {
                            switchToAccount(account.user.id)
                            setShowAccountMenu(false)
                          }}
                          className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 transition ${
                            account.user.id === user.id ? 'bg-indigo-50' : ''
                          }`}
                        >
                          {account.user.profilePicture ? (
                            <img src={account.user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                              {account.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{account.user.name}</p>
                            <p className="text-xs text-gray-500">{account.user.email}</p>
                          </div>
                          {account.user.id === user.id && (
                            <span className="ml-auto text-green-500">✓</span>
                          )}
                        </button>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <Link
                          to="/login"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 transition"
                        >
                          + Add Account
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setShowAccountMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition"
                        >
                          Log Out All Accounts
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition text-sm font-semibold"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
