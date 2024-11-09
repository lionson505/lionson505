import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import data from '../receiver'; // Ensure this path points to your data.js file

const MessagingPage = () => {
    const [selectedReceiverType, setSelectedReceiverType] = useState(null);
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Create options for receiver types
    const receiverTypes = data.map(item => ({
        value: item.receiverType,
        label: item.receiverType.charAt(0).toUpperCase() + item.receiverType.slice(1) // Capitalize the first letter
    }));

    const handleReceiverTypeChange = (selectedOption) => {
        setSelectedReceiverType(selectedOption);
        setSelectedPeople([]); // Clear previous selections
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedPeople(selectedOptions);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // Filter receivers based on selected receiver type
    const filteredReceivers = selectedReceiverType
        ? data.find(item => item.receiverType === selectedReceiverType.value)?.receivers || []
        : [];

    const options = filteredReceivers.map(person => ({
        value: person.phone,
        label: person.name,
    }));

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedPeople.length || !message.trim()) {
            setError('Please select at least one recipient and enter a message.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Send message to backend to process SMS
            const recipientPhones = selectedPeople.map(person => person.value); // Get the phone numbers of selected people
            const response = await axios.post('/api/send-sms', {
                phones: recipientPhones,
                message: message,
            });

            // Handle success
            setSuccess('Message sent successfully!');
            setMessage('');
            setSelectedPeople([]);
        } catch (err) {
            console.error(err);
            setError('Failed to send the message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <h1 className="text-xl font-bold text-center">Select People to Message</h1>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                    <div className="flex flex-col gap-4">
                        <label htmlFor="receiverTypeSelect" className="font-medium">Select Receiver Type:</label>
                        <Select
                            id="receiverTypeSelect"
                            options={receiverTypes}
                            onChange={handleReceiverTypeChange}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                }),
                            }}
                        />

                        <label htmlFor="peopleSelect" className="font-medium">Select People:</label>
                        <Select
                            id="peopleSelect"
                            options={options}
                            isMulti
                            onChange={handleSelectChange}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                }),
                            }}
                        />
                        
                        <label htmlFor="messageInput" className="font-medium">Message:</label>
                        <textarea
                            id="messageInput"
                            value={message}
                            onChange={handleMessageChange}
                            rows="4"
                            className="border rounded p-2"
                            placeholder="Type your message here..."
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessagingPage;
