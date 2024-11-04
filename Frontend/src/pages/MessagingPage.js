import React, { useState } from 'react';
import Select from 'react-select';
import data from '../receiver'; // Ensure this path points to your data.js file

const MessagingPage = () => {
    const [selectedReceiverType, setSelectedReceiverType] = useState(null);
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Log the selected people
        const selectedNames = selectedPeople.map(option => option.label);
        console.log('Selected names:', selectedNames);

        if (message.trim()) {
            const receiverAddresses = selectedPeople.map(option => option.value);

            // Log the receiver addresses and message
            console.log('Receiver addresses:', receiverAddresses);
            console.log('Message content:', message);

            setLoading(true);
            setError('');

            try {
                const response = await fetch('https://api.mtn.com/v3/sms/messages/sms/outbound', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer your-auth-token', // Replace with your token
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        senderAddress: "MTN",
                        receiverAddress: receiverAddresses,
                        message: message,
                        clientCorrelatorId: "your-client-correlator-id", // Replace as needed
                        keyword: "your-keyword", // Replace as needed
                        serviceCode: "11221", // Adjust as needed
                        requestDeliveryReceipt: false
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Get the response text
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                alert(`Message sent to: ${selectedNames.join(', ')}\nMessage: ${message}`);
                setMessage('');
                setSelectedPeople([]);
            } catch (error) {
                console.error('Error sending message:', error);
                setError(`Failed to send message: ${error.message}`);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please enter a message.');
        }
    };

    // Filter receivers based on selected receiver type
    const filteredReceivers = selectedReceiverType
        ? data.find(item => item.receiverType === selectedReceiverType.value)?.receivers || []
        : [];

    const options = filteredReceivers.map(person => ({
        value: person.phone,
        label: person.name,
    }));

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <h1 className="text-xl font-bold text-center">Select People to Message</h1>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5">
                    {error && <div className="text-red-500">{error}</div>}
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
