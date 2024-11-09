import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext
}) {
  const [sale, setSale] = useState({
    userID: authContext.user,
    productID: "",
    stockSold: "",
    saleDate: "",
  });
  const [open, setOpen] = useState(true);
  const [maxStockSold, setMaxStockSold] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (sale.productID) {
      fetchStockData();
      fetchSalesData();
    }
  }, [authContext.user, sale.productID]);

  const fetchStockData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/stockin/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        const stockReceived = data.reduce((acc, entry) => {
          const productName = entry.ProductID?.name || "Unknown Product";
          acc[productName] = (acc[productName] || 0) + entry.StockSold;
          return acc;
        }, {});

        const productTotalReceived = stockReceived[products.find(p => p._id === sale.productID)?.name] || 0;
        const productTotalSold = calculateTotalStockSold(sale.productID);
        const difference = productTotalReceived - productTotalSold;
        setMaxStockSold(Math.max(difference, 0));
      })
      .catch((err) => console.log(err));
  };

  const fetchSalesData = () => {
    fetch(`https://netcompassion-backend.onrender.com/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        // Logic for sales data can go here if needed
      })
      .catch((err) => console.log(err));
  };

  const calculateTotalStockSold = (productID) => {
    // Placeholder for actual sales data
    const salesEntries = []; // Replace with actual fetched data
    return salesEntries.reduce((sum, entry) => {
      return entry.productID === productID ? sum + entry.stockSold : sum;
    }, 0);
  };

  const handleInputChange = (key, value) => {
    setSale({ ...sale, [key]: value });
  };

  const addSale = () => {
    if (parseInt(sale.stockSold) > maxStockSold) {
      setErrorMessage(`Stock sold cannot exceed the maximum of ${maxStockSold}.`);
      return;
    } else {
      setErrorMessage(""); // Clear error message if validation passes
    }

    fetch("http://localhost:4000/api/sales/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(sale),
    })
      .then((result) => {
        alert("Sale ADDED");
        handlePageUpdate();
        addSaleModalSetting();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg py-4 font-semibold leading-6 text-gray-900">
                        Add Sale
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="productID" className="block mb-2 text-sm font-medium text-gray-900">
                              Product Name
                            </label>
                            <select
                              id="productID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="productID"
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            >
                              <option value="">Select Products</option>
                              {products.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="stockSold" className="block mb-2 text-sm font-medium text-gray-900">
                              Stock Sold
                            </label>
                            <input
                              type="number"
                              name="stockSold"
                              id="stockSold"
                              value={sale.stockSold}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              max={maxStockSold}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder={maxStockSold}
                            />
                            {errorMessage && (
                              <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
                            )}
                          </div>
                          <div className="h-fit w-fit">
                            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="saleDate">
                              Sales Date
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              type="date"
                              id="saleDate"
                              name="saleDate"
                              value={sale.saleDate}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                            onClick={addSale}
                          >
                            Add Sale
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => addSaleModalSetting()}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
