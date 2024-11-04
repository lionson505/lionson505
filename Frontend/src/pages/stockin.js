import React, { useState, useEffect, useContext } from "react";
import AddStock from "../components/AddStockin"; // Import your modal component
import AuthContext from "../AuthContext";

function Stockin() {
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockEntries, setStockEntries] = useState([]);
  const [salesEntries, setSalesEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [latestStockEntries, setLatestStockEntries] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchStockData();
    fetchSalesData();
    fetchProductsData();
  }, [updatePage]);

  const fetchStockData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/stockin/${authContext.user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setStockEntries(data);
        setLatestStockEntries(data.sort((a, b) => new Date(b.StockinDate) - new Date(a.StockinDate)).slice(0, 5));
      })
      .catch((err) => console.log(err));
  };

  const fetchSalesData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/sales/get/${authContext.user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setSalesEntries(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/product/get/${authContext.user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const toggleStockModal = () => {
    setShowStockModal(!showStockModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const groupedStockEntries = stockEntries.reduce((acc, entry) => {
    const productName = entry.ProductID?.name || "Unknown Product";
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(entry);
    return acc;
  }, {});

  const groupedSalesEntries = salesEntries.reduce((acc, entry) => {
    const productName = entry.ProductID?.name || "Unknown Product";
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(entry);
    return acc;
  }, {});

  // Group latest stock entries by product name
  const groupedLatestStockEntries = latestStockEntries.reduce((acc, entry) => {
    const productName = entry.ProductID?.name || "Unknown Product";
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(entry);
    return acc;
  }, {});

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
                  Total Stock Received
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Difference
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Latest Stockin Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedStockEntries).map(([productName, stockEntries]) => {
                const totalStockReceived = stockEntries.reduce((sum, entry) => sum + entry.StockSold, 0);
                const totalStockSold = (groupedSalesEntries[productName] || []).reduce(
                  (sum, entry) => sum + entry.StockSold,
                  0
                );
                const difference = totalStockReceived - totalStockSold;
                const latestStockinDate = new Date(Math.max(...stockEntries.map(entry => new Date(entry.StockinDate))));

                return (
                  <tr key={productName}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {productName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {totalStockReceived}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {totalStockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {difference}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {latestStockinDate.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section for Latest Stock Entries */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 mt-5">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <span className="font-bold">Latest Stock Entries</span>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Quantity
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Latest Stockin Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedLatestStockEntries).map(([productName, entries]) => {
                const totalQuantity = entries.reduce((sum, entry) => sum + entry.StockSold, 0);
                const latestStockinDate = new Date(Math.max(...entries.map(entry => new Date(entry.StockinDate))));

                return (
                  <tr key={productName}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {productName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {totalQuantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {latestStockinDate.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stockin;
