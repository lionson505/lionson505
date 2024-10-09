import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddYouth({
  toggleYouthModal,
  handlePageUpdate,
  authContext,
  currentYouth,
}) {
  const [youth, setYouth] = useState({
    userID: authContext.user || "",
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    educationLevel: "",
    schoolName: "",
    sex: "", // Added field for sex,
    compassion:authContext.user.compassion
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentYouth) {
      setYouth(currentYouth);
    }
  }, [currentYouth]);

  const handleInputChange = (key, value) => {
    setYouth((prevYouth) => ({ ...prevYouth, [key]: value }));
  };

  const addOrUpdateYouth = async () => {
    // Validate fields
    if (!authContext.user) {
      setError("User ID is required.");
      return;
    }
    if (!youth.firstName || !youth.lastName || !youth.birthday || !youth.address || !youth.educationLevel || !youth.schoolName || !youth.sex) {
      setError("All fields are required.");
      return;
    }

    try {
      const method = currentYouth ? "PUT" : "POST"; // Determine method
      const url = currentYouth
        ? `http://localhost:4000/api/youth/${currentYouth._id}`
        : "http://localhost:4000/api/youth";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(youth),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      alert(currentYouth ? "Youth updated successfully!" : "Youth added successfully!");
      handlePageUpdate();
      toggleYouthModal(); // Close the modal
    } catch (err) {
      setError(err.message || "An error occurred while processing the request.");
      console.error(err);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={toggleYouthModal}>
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
                        {currentYouth ? "Update Youth" : "Add Youth"}
                      </Dialog.Title>

                      {/* Error Message */}
                      {error && <div className="mb-4 text-red-600">{error}</div>}

                      <form>
                        <div className="grid gap-4 mb-4">
                          <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={youth.firstName}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter first name"
                            />
                          </div>

                          <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={youth.lastName}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter last name"
                            />
                          </div>

                          <div>
                            <label htmlFor="birthday" className="block mb-2 text-sm font-medium text-gray-900">
                              Birthday
                            </label>
                            <input
                              type="date"
                              id="birthday"
                              name="birthday"
                              value={youth.birthday}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                          </div>

                          <div>
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={youth.address}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter address"
                            />
                          </div>

                          <div>
                            <label htmlFor="educationLevel" className="block mb-2 text-sm font-medium text-gray-900">
                              Education Level
                            </label>
                            <input
                              type="text"
                              name="educationLevel"
                              id="educationLevel"
                              value={youth.educationLevel}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter education level"
                            />
                          </div>

                          <div>
                            <label htmlFor="schoolName" className="block mb-2 text-sm font-medium text-gray-900">
                              School Name
                            </label>
                            <input
                              type="text"
                              name="schoolName"
                              id="schoolName"
                              value={youth.schoolName}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter school name"
                            />
                          </div>

                          <div>
                            <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900">
                              Sex
                            </label>
                            <select
                              name="sex"
                              id="sex"
                              value={youth.sex}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            >
                              <option value="">Select sex</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="non-binary">Non-binary</option>
                            </select>
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
                    onClick={addOrUpdateYouth}
                  >
                    {currentYouth ? "Update Youth" : "Add Youth"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={toggleYouthModal}
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
