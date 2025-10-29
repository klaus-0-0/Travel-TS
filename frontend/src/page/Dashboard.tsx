import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/luggage.png"
import button1 from "../assets/hamburger.png"
import power from "../assets/power.png"
import search from "../assets/search2.png"
import config from "../config";

interface TravelItem {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable?: boolean;
  createdAt: string;
}

interface DashboardProps {
  setData: (item: TravelItem) => void;
}

const Dashboard = ({ setData }: DashboardProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TravelItem[]>([]);
  const [expandSidebar, setExpandSidebar] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/FetchTravelLocation`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Items data: ", res.data);
        setItems(res.data.destinations || []);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-info");
    navigate("/login");
  };

  const handleAddToCart = async (item: TravelItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${config.apiUrl}/cart/add`,
        {
          itemId: item.id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  const handleBuyNow = (item: TravelItem) => {
    alert("Buy Now feature coming soon!");
  };

  const formatPrice = (price: number) => {
    if (!price) return "₹0";
    const numericPrice = parseFloat(price.toString().replace(/[^\d.]/g, ''));
    return `₹${numericPrice.toLocaleString('en-IN')}`;
  };

  const handleImgClick = (item: TravelItem) => {
    setData(item);
    navigate("/Destination");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-100 shadow-lg">
        <div className="relative flex gap-3 items-center justify-center p-2">
          <img src={logo} className="h-15 w-15" alt="Logo" />

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-55  sm:w-full h-12 border border-gray-300 rounded-full shadow-sm pl-4 pr-12"
            />
            <img
              src={search}
              className="h-6 w-6 absolute right-4 top-3 cursor-pointer"
              alt="Search"
            />
          </div>

          <button className="h-6 w-6 cursor-pointer" onClick={handleSignout}>
            <img className="h-6 w-6 cursor-pointer" src={power} alt="Logout" />
          </button>
          <button>
            <img className="h-6 w-6 cursor-pointer" src={button1} alt="Menu" />
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 py-2">
        <input
          placeholder="Search products..."
          className="w-full rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="sticky top-22 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-sm border hover:bg-gray-400 transition-color cursor-pointer ml-2 mt-2"
        onClick={() => setSideBar(!sideBar)}
      >
        ☰
      </button>

      {/* Sidebar */}
      {sideBar && (
        <div
          className={`fixed left-0 top-16 sm:top-16 h-full bg-black transition-all duration-300 ease-in-out ${expandSidebar ? 'w-48 sm:w-52' : 'w-12 sm:w-16'} z-40`}
          onMouseEnter={() => setExpandSidebar(true)}
          onMouseLeave={() => setExpandSidebar(false)}
        >
          <div className="space-y-3 sm:space-y-4 p-2 sm:p-3 mt-4 sm:mt-8">
            <button className={`flex items-center w-full p-2 sm:p-3 text-black bg-amber-50 rounded-lg transition-all cursor-pointer ${expandSidebar ? 'justify-start' : 'justify-center'}`}>
              <span className="text-lg sm:text-xl min-w-5 sm:min-w-6">🌏</span>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm hover:scale-105 transition-all duration-300 ${expandSidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
                All Destinations
              </span>
            </button>
            <button className={`flex items-center w-full p-2 sm:p-3 text-black bg-amber-50 rounded-lg transition-all cursor-pointer ${expandSidebar ? 'justify-start' : 'justify-center'}`}>
              <span className="text-lg sm:text-xl min-w-5 sm:min-w-6">⭐</span>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm hover:scale-105 transition-all duration-300 ${expandSidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
                Popular Trips
              </span>
            </button>
            <button className={`flex items-center w-full p-2 sm:p-3 text-black bg-amber-50 rounded-lg transition-all cursor-pointer ${expandSidebar ? 'justify-start' : 'justify-center'}`}>
              <span className="text-lg sm:text-xl min-w-5 sm:min-w-6">💸</span>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm hover:scale-105 transition-all duration-300 ${expandSidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
                Budget Travel
              </span>
            </button>
            <button className={`flex items-center w-full p-2 sm:p-3 text-black bg-amber-50 rounded-lg transition-all cursor-pointer ${expandSidebar ? 'justify-start' : 'justify-center'}`}>
              <span className="text-lg sm:text-xl min-w-5 sm:min-w-6">📅</span>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm hover:scale-105 transition-all duration-300 ${expandSidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
                My Bookings
              </span>
            </button>
            <button className={`flex items-center w-full p-2 sm:p-3 text-black bg-amber-50 rounded-lg transition-all cursor-pointer ${expandSidebar ? 'justify-start' : 'justify-center'}`}>
              <span className="text-lg sm:text-xl min-w-5 sm:min-w-6">❓</span>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm hover:scale-105 transition-all duration-300 ${expandSidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
                Support
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay when sidebar is open */}
      {sideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:bg-transparent"
          onClick={() => setSideBar(false)}
        ></div>
      )}

      {/* Available Items Section */}
      <div className={`relative mt-4 px-2 sm:px-4 ${sideBar ? 'ml-12 sm:ml-16' : 'ml-0'} transition-all duration-300`}>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Available Products</h2>

        {items.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
            <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">No products available</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-20 sm:gap-20 md:gap-20">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                style={{
                  width: 'calc(50% - 0.375rem)',
                  maxWidth: '200px',
                  minWidth: '140px'
                }}
              >
                {/* Product Image */}
                <button className="cursor-pointer w-full h-full aspect-square bg-gray-100 rounded-t-lg overflow-hidden" onClick={() => handleImgClick(item)}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl mb-1">📷</div>
                        <p className="text-xs">No Image</p>
                      </div>
                    </div>
                  )}
                </button>

                {/* Product Info */}
                <div className="p-2">
                  <div className="mb-1">
                    <h3 className="text-xs font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-1 py-0.5 text-[10px] rounded ${item.isAvailable !== false
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}>
                      {item.isAvailable !== false ? "Available" : "Sold Out"}
                    </span>
                    <span className="font-mono text-xs font-bold text-green-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;