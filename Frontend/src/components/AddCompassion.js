import React, { useState, useEffect } from 'react';

const AddCompassion = ({ onClose, onAdd, onUpdate, record }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        church: '',
        address: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        if (record) {
            setFormData(record); // Populate form with record data for updating
        }
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine if it's an add or update operation
        const url = record
            ? `https://netcompassion-backend.onrender.com/api/compassion/${record._id}`
            : 'https://netcompassion-backend.onrender.com/api/compassion';
        const method = record ? 'PUT' : 'POST';
 
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const savedRecord = await response.json();
            if (record) {
                onUpdate(savedRecord); // Callback for updating the record
            } else {
                onAdd(savedRecord); // Callback for adding the new record
            }
            onClose(); // Close the modal
        } else {
            console.error('Failed to save compassion record');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 w-11/12 md:w-1/3">
                <h2 className="text-lg font-bold mb-4">{record ? 'Update' : 'Add'} Compassion Record</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white p-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">{record ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompassion;
