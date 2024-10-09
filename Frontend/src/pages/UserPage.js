import React, { useEffect, useState } from 'react';
import AddUserModal from '../components/AddUserModal';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [compassionRecords, setCompassionRecords] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingCompassion, setLoadingCompassion] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4000/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Oops! We couldn’t fetch the user list. Please try again later. 😢');
            console.error('Fetch Users Error:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchCompassionRecords = async () => {
        setLoadingCompassion(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4000/api/compassion');
            if (!response.ok) throw new Error('Failed to fetch compassion records');
            const data = await response.json();
            setCompassionRecords(data);
        } catch (err) {
            setError('Oops! We couldn’t fetch the compassion records. Please try again later. 😢');
            console.error('Fetch Compassion Records Error:', err);
        } finally {
            setLoadingCompassion(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCompassionRecords();
    }, []);

    const combinedRecords = users.map(user => {
        const compassionRecord = compassionRecords.find(c => c._id === user.compassion?._id);
        return {
            ...user,
            compassionDetail: compassionRecord ? compassionRecord.code : 'No Compassion Info',
        };
    });

    const filteredRecords = combinedRecords.filter(user => 
        user.compassionDetail.toLowerCase().includes(searchQuery.toLowerCase())
    );
const handleUpdate = async (updatedUser) => {
    setShowModal(false);
    try {
        const response = await fetch(`http://localhost:4000/api/users/${updatedUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        const updatedData = await response.json();
        setUsers(prevUsers => prevUsers.map(user => (user._id === updatedUser._id ? updatedData : user)));
    } catch (err) {
        setError(err.message || 'Oops! Something went wrong while updating the user. Please try again. 😢');
        console.error('Update Error:', err);
    }
};

const handleAdd = async (newUser) => {
    setShowModal(false);
    try {
        const response = await fetch('http://localhost:4000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        const addedUser = await response.json();
        setUsers(prevUsers => [...prevUsers, addedUser]);
    } catch (err) {
        console.error('Add User Error:', err);
        setError('Oops! Something went wrong while adding the user. Please try again. 😢');
    }
};

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:4000/api/users/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete user');
                setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                alert('User deleted successfully! 🗑️');
            } catch (err) {
                setError('Oops! Something went wrong while deleting the user. Please try again. 😢');
                console.error('Delete User Error:', err);
            }
        }
    };

    if (loadingUsers || loadingCompassion) return <div className="text-center">Loading... Please wait a moment. 😊</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <h1 className="text-3xl font-bold mb-6 text-center">User List</h1>

                <input
                    type="text"
                    placeholder="Search by Compassion Code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 border rounded p-2"
                />

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setIsUpdating(false);
                            setSelectedUser(null);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded"
                    >
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 shadow-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                        <thead>
                            <tr>
                                {["First Name", "Last Name", "Email", "Phone Number", "Role", "Compassion", "Actions"].map(header => (
                                    <th key={header} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRecords.map(user => (
                                <tr key={user._id} className="hover:bg-gray-100">
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{user.firstName}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{user.lastName}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.email}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.phoneNumber}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.role}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.compassionDetail}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowModal(true);
                                                setIsUpdating(true);
                                            }}
                                            className="text-blue-500 hover:underline"
                                            aria-label={`Edit ${user.firstName} ${user.lastName}`}
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-500 hover:underline ml-2"
                                            aria-label={`Delete ${user.firstName} ${user.lastName}`}
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
                    <AddUserModal
                        user={isUpdating ? selectedUser : null}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedUser(null);
                            setIsUpdating(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default UserPage;
