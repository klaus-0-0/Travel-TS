import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const AdminDashboard = () => {
    const [items, setItems] = useState<TravelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchValues = async () => {
            try {
                interface ApiResponse {
                    items: TravelItem[];
                }
                const res = await axios.post<ApiResponse>(`${config.apiUrl}/AdminDashboard`, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                console.log(res);

                setItems(res.data.items || []);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchValues();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        navigate("/login");
    };

    const handleCreateItem = () => {
        navigate("/AdminUploadItems");
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm("Are you sure you want to delete this travel location?")) {
            try {
                await axios.delete(`${config.apiUrl}/admin/items/${itemId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });

                // Remove from local state
                setItems(items.filter(item => item.id !== itemId));
                alert("Travel location deleted successfully!");

            } catch (err) {
                console.error("Error deleting item:", err);
                alert("Failed to delete travel location");
            }
        }
    };

    const handleBooking = () => {
        navigate("/handleBooking");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">🛍️ Admin Dashboard</h1>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCreateItem}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            + Add Product
                        </button>
                        <button
                            onClick={handleBooking}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            booking
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Products Management</h2>
                    <p className="text-gray-600">Manage your products inventory</p>
                    <p className="text-sm text-green-600 mt-1">
                        Total Products: {items.length}
                    </p>
                </div>

                {/* Products Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <p className="text-gray-500 text-lg mb-4">No products available</p>
                        <button
                            onClick={handleCreateItem}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="space-x-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Product Image */}
                                <div className="w-full h-full aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <div className="text-2xl mb-1">📷</div>
                                                <p className="text-xs">No Image</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

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
                                            ₹{item.price}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => navigate(`/edit-item/${item.id}`)}
                                            className="flex-1 bg-blue-100 text-blue-700 px-1 py-1 rounded text-[10px] hover:bg-blue-200 transition-colors cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="flex-1 bg-red-100 text-red-700 px-1 py-1 rounded text-[10px] hover:bg-red-200 transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;