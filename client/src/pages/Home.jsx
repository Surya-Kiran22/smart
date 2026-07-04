import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { formatPrice } from '../utils/currency'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [myBids, setMyBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', status: '', search: '' })

  useEffect(() => {
    fetchItems()
    if (user) {
      fetchMyBids()
    }
  }, [filter, user])

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.status) params.append('status', filter.status)
      if (filter.search) params.append('search', filter.search)

      const response = await axios.get(`/api/items?${params}`)
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyBids = async () => {
    try {
      const response = await axios.get('/api/bids/my')
      // Filter only live auctions
      const liveBids = response.data.filter(bid => bid.item.status === 'live')
      setMyBids(liveBids)
    } catch (error) {
      console.error('Error fetching my bids:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ended': return 'bg-gray-100 text-gray-800'
      case 'settled': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  const formatTimeRemaining = (endTime) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">🎓 CampusBid Marketplace</h1>
        <p className="text-lg text-indigo-100 mb-4">Buy & sell used items with real-time bidding. Get the best price for your books, calculators, cycles & more!</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">✅ Real-time Bidding</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">✅ Secure Payments</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">✅ Student Verified</div>
        </div>
      </div>

      {/* Ongoing Bids Section */}
      {myBids.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🔥</span> Your Ongoing Bids
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBids.map((bid) => (
              <Link key={bid.id} to={`/item/${bid.item.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition transform hover:-translate-y-1 border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{bid.item.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Your Bid:</span>
                    <span className="font-bold text-indigo-600">{formatPrice(bid.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Current Highest:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(bid.item.currentHighestBid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    {bid.isWinning ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 flex items-center">
                        <span className="mr-1">✓</span> Winning
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 flex items-center">
                        <span className="mr-1">!</span> Outbid
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🛍️</span> Browse Items
        </h2>

        
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search items..."
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="books">Books</option>
            <option value="calculators">Calculators</option>
            <option value="cycles">Cycles</option>
            <option value="other">Other</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-indigo-600">{formatPrice(item.currentHighestBid)}</p>
                  </div>
                  {item.status === 'live' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Time Left</p>
                      <p className="text-lg font-semibold text-red-600">{formatTimeRemaining(item.endTime)}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Seller: {item.seller.name}</span>
                  <span>{item.condition}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
