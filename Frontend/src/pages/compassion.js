import React, { useEffect, useState } from 'react';
import AddCompassion from '../components/AddCompassion';

const CompassionPage = () => {
    const [compassionRecords, setCompassionRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    useEffect(() => {
        const fetchCompassionRecords = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/compassion');
                if (!response.ok) {
                    throw new Error('Failed to fetch compassion records');
                }
                const data = await response.json();
                setCompassionRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompassionRecords();
    }, []);

    const handleAddCompassion = async (newRecord) => {
        try {
            const response = await fetch('http://localhost:4000/api/compassion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });
            if (!response.ok) {
                throw new Error('Failed to add compassion record');
            }
            const data = await response.json();
            setCompassionRecords((prev) => [...prev, data]);
            setShowModal(false); // Close the modal
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateCompassion = async (updatedRecord) => {
        try {
            const response = await fetch(`http://localhost:4000/api/compassion/${updatedRecord._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecord),
            });
            if (!response.ok) {
                throw new Error('Failed to update compassion record');
            }
            const data = await response.json();
            setCompassionRecords((prev) =>
                prev.map(record => (record._id === data._id ? data : record))
            );
            setCurrentRecord(null); // Clear currentRecord
        } catch (err) {
            setError(err.message);
        } finally {
            setShowModal(false); // Close the modal
        }
    };

    const handleDeleteCompassion = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/compassion/${id}`, {
                method: 'DELETE',
            });
            setCompassionRecords((prev) => prev.filter(record => record._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <div className="flex justify-between">
                    <span className="font-bold text-xl">Compassion Records</span>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                        onClick={() => {
                            setCurrentRecord(null); // Reset currentRecord for adding
                            setShowModal(true);
                        }}
                    >
                        Add Compassion
                    </button>
                </div>
                <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
                    <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                        <thead>
                            <tr>
                                {['Code', 'Name', 'Church', 'Address', 'Phone', 'Email', 'Actions'].map((header) => (
                                    <th key={header} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {compassionRecords.map(record => (
                                <tr key={record._id}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{record.code}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.name}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.church}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.address}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.phone}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.email}</td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => {
                                                setCurrentRecord(record);
                                                setShowModal(true); // Use the same modal for updating
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 hover:underline ml-2"
                                            onClick={() => handleDeleteCompassion(record._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <AddCompassion 
                        onClose={() => {
                            setShowModal(false);
                            setCurrentRecord(null); // Clear currentRecord when modal closes
                        }} 
                        onAdd={handleAddCompassion} 
                        onUpdate={handleUpdateCompassion}
                        record={currentRecord} // Pass currentRecord for updating
                    />
                )}
            </div>
        </div>
    );
};

export default CompassionPage;
