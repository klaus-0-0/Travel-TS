import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

interface TravelItem {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface DestinationProps {
  data: TravelItem | null;
}

function Destination({ data }: DestinationProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No destination selected</p>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return data.price;
    
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return data.price * nights * guests;
  };

  const handleBookNow = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        locationId: data.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: guests,
        totalPrice: calculateTotalPrice()
      };

      const response = await axios.post(
        `${config.apiUrl}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image */}
          <div>
            <img
              src={data.imageUrl}
              alt={data.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Side - Details & Booking */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{data.name}</h1>
            <p className="text-gray-600 mb-4">{data.country}</p>
            <p className="text-gray-700 mb-6">{data.description}</p>

            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl font-bold text-green-600">
                ₹{data.price} <span className="text-sm text-gray-500">per night</span>
              </p>
            </div>

            {/* Booking Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Total Price */}
              {(checkIn && checkOut) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold">
                    Total: ₹{calculateTotalPrice()}
                    <span className="text-sm text-gray-500 ml-2">
                      ({guests} guest{guests > 1 ? 's' : ''})
                    </span>
                  </p>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Destination;