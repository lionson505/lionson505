import React, { useState, useEffect, useContext } from "react";
import AddStock from "../components/AddStockin"; // Import your modal component
import AuthContext from "../AuthContext";

function StockReport() {
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockEntries, setStockEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchStockData();
    fetchProductsData();
  }, [updatePage]);

  // Fetching Data of All Stock Entries
  const fetchStockData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/stockin/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setStockEntries(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Modal for Stock Add
  const toggleStockModal = () => {
    setShowStockModal(!showStockModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showStockModal && (
          <AddStock
            toggleStockModal={toggleStockModal}
            products={products}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        <br />
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Stock Entries</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={toggleStockModal}
              >
                Add Stock
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  StockReport Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockEntries.map((entry) => (
                <tr key={entry._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {entry.ProductID?.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {entry.StockSold}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(entry.StockinDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockReport;
