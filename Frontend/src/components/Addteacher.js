import React, { useEffect, useState } from 'react';

const AddTeacher = ({ user, onAdd, onUpdate, onClose }) => {
    const roles = [ 'teacher'];
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        compassion: '',
        password: '', // Add password field
    });
    const [compassionOptions, setCompassionOptions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber.toString(),
                role: user.role,
                compassion: user.compassion ? user.compassion._id : '',
                password: '', // Reset password field for updates
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchCompassionOptions = async () => {
            try {
                const response = await fetch('https://netcompassion-backend.onrender.com/api/compassion');
                if (!response.ok) throw new Error('Failed to fetch compassion data');
                const data = await response.json();
                setCompassionOptions(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCompassionOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6; // Example validation
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(formData.password)) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        const method = user ? 'PUT' : 'POST';
        const url = user ? `https://netcompassion-backend.onrender.com/api/users/${user._id}` : 'https://netcompassion-backend.onrender.com/api/users';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save user');
            }

            const result = await response.json();
            user ? onUpdate(result) : onAdd(result);
            setSuccess(user ? 'User updated successfully!' : 'User added successfully!');
            setError('');
            setTimeout(onClose, 2000);
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-bold">{user ? 'Update User' : 'Add New User'}</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => {
                        if (key === 'role') {
                            return (
                                <div key={key} className="mb-2">
                                    <label className="block">Role</label>
                                    <select
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                        required
                                    >
                                        <option value="" disabled>Select role</option>
                                        {roles.map(role => (
                                            <option key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }

                        if (key === 'compassion') {
                            return (
                                <div key={key} className="mb-2">
                                    <label className="block">Compassion</label>
                                    <select
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                        required
                                    >
                                        <option value="" disabled>Select compassion</option>
                                        {compassionOptions.map(compassion => (
                                            <option key={compassion._id} value={compassion._id}>
                                                {compassion.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="mb-2">
                                <label className="block">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input
                                    type={key === 'phoneNumber' ? 'tel' : key === 'password' ? 'password' : 'text'}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="border rounded p-1 w-full"
                                    required={key !== 'compassion'} // Make compassion optional
                                />
                            </div>
                        );
                    })}
                    <button type="submit" className="bg-blue-500 text-white rounded p-2">
                        {user ? 'Update User' : 'Add User'}
                    </button>
                    <button type="button" onClick={onClose} className="ml-2 border rounded p-2">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacher;
