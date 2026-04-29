"use client";
import { useEffect, useState } from "react";

export default function Sale() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalSaleData, setGlobalSaleData] = useState({
        headline: "",
        sale_discount_percentage: "",
        start_date: "",
        end_date: ""
    });
    const [createdSaleId, setCreatedSaleId] = useState<number | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [saleproducts, setsaleproducts] = useState<any[]>([])
    const [productsOnSaleIds, setProductsOnSaleIds] = useState<number[]>([]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSale = async () => {
        try {
            const sales = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/getsale`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await sales.json()
            if (data.response && Array.isArray(data.response)) {
                if (data.response.length > 0) {
                    const sale = data.response[0];
                    setGlobalSaleData({
                        headline: sale.headline || "",
                        sale_discount_percentage: sale.sale_discount_percentage || "",
                        start_date: sale.start_date ? sale.start_date.split("T")[0] : "",
                        end_date: sale.end_date ? sale.end_date.split("T")[0] : ""
                    });
                    setsaleproducts(data.response)

                    setCreatedSaleId(sale.sale_id);
                } else {
                    setsaleproducts([]);
                }

                // Collect all product IDs that are already in any sale
                const onSaleIds = data.response
                    .map((item: any) => item.product_id)
                    .filter((id: any) => id !== null);
                setProductsOnSaleIds(onSaleIds);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSale()
        fetchProducts();
    }, []);

    const handleRemoveSingleProduct = async (saleId: number, productId: number) => {
        if (!confirm("Are you sure you want to remove this product from the sale?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/removesingleproduct/${saleId}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Product removed from sale!");
                fetchSale();
            } else {
                alert("Failed to remove product.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteEntireSale = async () => {
        if (!createdSaleId) return;
        if (!confirm("Are you sure you want to delete the ENTIRE sale? This will remove the banner and all product discounts.")) return;
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/removeproduct/${createdSaleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Entire sale deleted successfully!");
                setCreatedSaleId(null);
                setGlobalSaleData({
                    headline: "",
                    sale_discount_percentage: "",
                    start_date: "",
                    end_date: ""
                });
                fetchSale();
            } else {
                alert("Failed to delete sale.");
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred.");
        }
    };

    // Toggle a product selection
    const toggleProductSelection = (id: number) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pid => pid !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    // Toggle all products
    const toggleSelectAll = () => {
        const availableProducts = products.filter(p => !productsOnSaleIds.includes(p.id));
        if (selectedProducts.length === availableProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(availableProducts.map(p => p.id));
        }
    };

    // Publish Global Sale Banner (no products)
    const handleGlobalSubmit = async () => {


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/addproductonsale`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(globalSaleData)
            });

            const data = await response.json()
            if (data.response?.sale_id) {
                setCreatedSaleId(data.response.sale_id);
            }

            alert("Global Announcement published successfully!");
        } catch (error) {
            console.log(error);
        }
    };

    // Add selected products to the sale
    const handleAddSelectedToSale = async () => {
        if (selectedProducts.length === 0) {
            alert("Please select at least one product.");
            return;
        }

        if (!globalSaleData.sale_discount_percentage && !createdSaleId) {
            alert("Please enter a Discount Percentage in the Global Sale form first.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/addproductonsale`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    sale_id: createdSaleId,
                    product_ids: selectedProducts,
                    headline: globalSaleData.headline,
                    sale_discount_percentage: globalSaleData.sale_discount_percentage,
                    start_date: globalSaleData.start_date,
                    end_date: globalSaleData.end_date
                })
            });

            const data = await response.json();
            if (!createdSaleId && data.response?.sale_id) {
                setCreatedSaleId(data.response.sale_id);
            }

            alert(`${selectedProducts.length} Products added to sale successfully!`);
            setSelectedProducts([]); // Reset selection
            fetchSale(); // Refresh UI
        } catch (error) {
            console.log(error);
            alert("Failed to add products to sale.");
        }
    };


    const handleGlobalUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const udpatedsale = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/updatesale`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...globalSaleData, sale_id: createdSaleId })
            })
            const data = await udpatedsale.json()
            if (data.msg === "Sale updated successfully") {
                alert("Global Announcement updated successfully!");
            } else {
                alert("Failed to update Global Announcement.");
            }
        } catch (error) {
            console.log(error);
            alert("Failed to update Global Announcement.");
        }
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen relative">
            {/* 🔥 Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
                Sale Management
            </h1>

            {/* 📝 Global Headline Section */}
            <form
                onSubmit={createdSaleId ? handleGlobalUpdate : handleGlobalSubmit}
                className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-12"
            >
                <div className="mb-5 text-center">
                    <h2 className="text-xl font-bold text-gray-800">1. Setup Sale Details</h2>
                    <p className="text-gray-500 text-sm mt-1">Create or update the sale announcement banner.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Headline</label>
                        <input
                            type="text"
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 transition"
                            placeholder="e.g. Mega Summer Clearance Sale"
                            value={globalSaleData.headline}
                            onChange={(e) => setGlobalSaleData({ ...globalSaleData, headline: e.target.value })}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Percentage (%)</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 transition"
                            placeholder="e.g. 20"
                            value={globalSaleData.sale_discount_percentage}
                            onChange={(e) => setGlobalSaleData({ ...globalSaleData, sale_discount_percentage: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 transition"
                            value={globalSaleData.start_date}
                            onChange={(e) => setGlobalSaleData({ ...globalSaleData, start_date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 transition"
                            value={globalSaleData.end_date}
                            onChange={(e) => setGlobalSaleData({ ...globalSaleData, end_date: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition shadow-sm font-semibold text-base"
                    >
                        {createdSaleId ? "Update Global Banner" : "Publish Global Banner"}
                    </button>
                    {createdSaleId && (
                        <button
                            type="button"
                            onClick={handleDeleteEntireSale}
                            className="px-4 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100 transition shadow-sm font-semibold text-sm"
                        >
                            Delete Sale
                        </button>
                    )}
                </div>
            </form>


            {/* 🏷️ Products on Sale Section */}
            {saleproducts.filter(item => item.product_id).length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-2 bg-red-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800">Products Currently on Sale</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {saleproducts
                            .filter(item => item.product_id)
                            .map((item) => (
                                <div key={item.product_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative">
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={item.images?.[0]?.url || "/placeholder.png"}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                            {item.sale_discount_percentage}% OFF
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-800 truncate mb-1">{item.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-red-600 font-bold text-lg">Rs.{item.discounted_price}</span>
                                            <span className="text-gray-400 line-through text-xs">Rs.{item.price}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSingleProduct(item.sale_id, item.product_id)}
                                            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition duration-300"
                                        >
                                            Remove from Sale
                                        </button>

                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* 🛍️ Products Section */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">2. Apply Sale to Products</h2>
                        <p className="text-gray-500 text-sm mt-1">Select products below and apply the sale details set above.</p>
                    </div>

                    {products.filter(p => !productsOnSaleIds.includes(p.id)).length > 0 && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSelectAll}
                                className="text-sm font-semibold underline text-gray-600 hover:text-black transition"
                            >
                                {selectedProducts.length === products.filter(p => !productsOnSaleIds.includes(p.id)).length ? "Deselect All" : "Select All"}
                            </button>

                            <button
                                onClick={handleAddSelectedToSale}
                                disabled={selectedProducts.length === 0}
                                className={`py-2 px-6 rounded-lg font-bold text-white transition shadow-md
                                    ${selectedProducts.length > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}
                                `}
                            >
                                Add {selectedProducts.length > 0 ? selectedProducts.length : ""} to Sale
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : products.filter(p => !productsOnSaleIds.includes(p.id)).length === 0 ? (
                    <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">No products found. Add some products first.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products
                            .filter(p => !productsOnSaleIds.includes(p.id))
                            .map((product: any) => {
                                const isSelected = selectedProducts.includes(product.id);

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => toggleProductSelection(product.id)}
                                        className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer
                                        ${isSelected ? "border-red-500 shadow-md transform -translate-y-1" : "border-transparent hover:border-gray-200"}
                                    `}
                                    >
                                        {/* ✅ Selection Checkbox Overlay */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition
                                            ${isSelected ? "bg-red-500 border-red-500" : "bg-white/80 border-gray-300 backdrop-blur-sm"}
                                        `}>
                                                {isSelected && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* 📸 Image */}
                                        <div className="relative overflow-hidden bg-gray-100">
                                            <img
                                                src={product.images?.[0]?.url || "/placeholder.png"}
                                                alt={product.name}
                                                className={`w-full h-56 object-cover transition duration-500 ${isSelected ? "scale-105 opacity-90" : "group-hover:scale-105"}`}
                                            />

                                            {/* 🔥 Existing Discount Badge */}
                                            {product.discount_perc && (
                                                <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
                                                    -{product.discount_perc}%
                                                </span>
                                            )}
                                        </div>

                                        {/* 📦 Content */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-bold text-gray-800 text-lg truncate">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 capitalize mb-3">
                                                {product.type_gender}
                                            </p>

                                            <div className="flex items-center gap-3 mt-auto">
                                                <p className="font-extrabold text-xl text-black">
                                                    Rs.{product.after_discou || product.price}
                                                </p>

                                                {product.after_discou && (
                                                    <p className="font-medium text-sm line-through text-gray-400">
                                                        Rs.{product.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}