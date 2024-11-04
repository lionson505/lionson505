import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddStockin({
  addStockinModalSetting,
  products,
  handlePageUpdate,
  authContext,
}) {
  const [stockin, setStockin] = useState({
    userID: authContext.user || "", // Ensure a valid user ID
    ProductID: "",
    StockSold: "",
    StockinDate: "",
    TotalSaleAmount: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const maximum = 40;
  // Handle input change for input fields
  const handleInputChange = (key, value) => {
    setStockin((prev) => ({ ...prev, [key]: value }));
  };

  // POST Data
  const addStockin = () => {
  // Validate required fields
  if (!stockin.ProductID || !stockin.StockSold || !stockin.StockinDate || !stockin.TotalSaleAmount) {
    alert("Please fill in all required fields.");
    return;
  }

  console.log("Data to be sent:", stockin); // Debugging line

  fetch("https://netcompassion-backend.onrender.com/api/stockin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockin),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || 'Network response was not ok');
        });
      }
      return response.json();
    })
    .then(() => {
      alert("Stock In Added");
      handlePageUpdate();
      setOpen(false);
      // addStockinModalSetting();
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("An error occurred while adding stock: " + err.message);
    });
};

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
          addStockinModalSetting(); // Reset modal state on close
        }}
      >
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
                      <Dialog.Title
                        as="h3"
                        className="text-lg py-4 font-semibold leading-6 text-gray-900"
                      >
                        Add Stock In
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="ProductID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Product Name
                            </label>
                            <select
                              id="ProductID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                              name="ProductID"
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            >
                              <option value="" disabled>Select Products</option>
                              {products.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="StockSold"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stock Sold  
                            </label>
                            <input
                              type="number"
                              name="StockSold"
                              id="StockSold"
                              value={stockin.StockSold}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              minLength={1} maxLength={5}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                              placeholder='<Inter Amount of product>'
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="StockinDate"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stock In Date
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                              type="date"
                              id="StockinDate"
                              name="StockinDate"
                              value={stockin.StockinDate}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="TotalSaleAmount"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Total Sale Amount
                            </label>
                            <input
                              type="number"
                              name="TotalSaleAmount"
                              id="TotalSaleAmount"
                              value={stockin.TotalSaleAmount}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                              placeholder="$0.00"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addStockin}
                  >
                    Add Stock In
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      addStockinModalSetting(); // Reset modal state on close
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
