import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data';
import Modal from 'react-modal';
import jsPDF from 'jspdf';

// Set the app element for accessibility (important for screen readers)
Modal.setAppElement('#root');

const StudentList = () => {
    const { bankId, schoolId } = useParams();
    const company = data.banks[bankId].companies[schoolId];

    // Calculate the total school fees
    const totalFees = company.students.reduce((sum, student) => sum + student.schoolFees, 0);
    
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = async () => {
        const payload = {
            totalFees,
            schoolAccount: company.schoolAccount,
            hiddenValue: "23456789",
        };

        try {
            const response = await fetch('http://localhost:4000/api/schoolFees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                setModalIsOpen(true);  // Open modal on successful submission
            } else {
                console.error('Error:', response.statusText);
                alert('Failed to submit data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit data');
        }
    };

    const saveAsPDF = () => {
        const doc = new jsPDF();
        doc.text(`Submission Successful`, 14, 20);
        doc.text(`School Name: ${company.name}`, 14, 30);
        doc.text(`School Account: ${company.schoolAccount}`, 14, 40);
        doc.text(`Total School Fees: $${totalFees}`, 14, 50);
        
        let y = 60;
        doc.text(`Students:`, 14, y);
        company.students.forEach((student, index) => {
            y += 10; // Move down 10 units for each student
            doc.text(`${student.firstname} ${student.lastname} - ${student.educationLevel}`, 14, y);
        });

        doc.save('students.pdf');
    };

    const shareOnWhatsApp = () => {
        const message = `Check out the submission details for ${company.name}:\n\nTotal School Fees: $${totalFees}\n\nStudents:\n${company.students.map(student => `${student.firstname} ${student.lastname} - ${student.educationLevel}`).join('\n')}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const shareOnGmail = () => {
        const subject = `Submission Details for ${company.name}`;
        const body = `Check out the submission details:\n\nSchool Account: ${company.schoolAccount}\nTotal School Fees: $${totalFees}\n\nStudents:\n${company.students.map(student => `${student.firstname} ${student.lastname} - ${student.educationLevel}`).join('\n')}`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center">
            <div className="flex flex-col gap-5 w-11/12">
                <h1 className="text-2xl font-bold mb-5">Students in {company.name}</h1>
                <h2 className="text-lg">School Account: {company.schoolAccount}</h2>
                <h2 className="text-lg">Total School Fees: ${totalFees}</h2>
                
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white shadow-md">
                    <thead>
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">First Name</th>
                            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Last Name</th>
                            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Education Level</th>
                            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">School Fees</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {company.students.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                <td className="whitespace-nowrap px-4 py-2">{student.firstname}</td>
                                <td className="whitespace-nowrap px-4 py-2">{student.lastname}</td>
                                <td className="whitespace-nowrap px-4 py-2">{student.educationLevel}</td>
                                <td className="whitespace-nowrap px-4 py-2">${student.schoolFees}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button 
                    onClick={handleSubmit} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded mt-4"
                >
                    Submit Data
                </button>

                {/* Modal for displaying submission details */}
                <Modal 
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Submission Details"
                >
                    <h2 className="text-2xl font-bold">Submission Successful</h2>
                    <p>School Name: {company.name}</p>
                    <p>School Account: {company.schoolAccount}</p>
                    <p>Total School Fees: ${totalFees}</p>
                    <h3 className="font-medium">Students:</h3>
                    
                    {/* Table for students in the modal */}
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white shadow-md mt-4">
                        <thead>
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">First Name</th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Last Name</th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Education Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {company.students.map((student, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                    <td className="whitespace-nowrap px-4 py-2">{student.firstname}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{student.lastname}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{student.educationLevel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button 
                        onClick={saveAsPDF}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded mt-4"
                    >
                        Save as PDF
                    </button>
                    <button 
                        onClick={shareOnWhatsApp}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold p-2 rounded mt-4"
                    >
                        Share on WhatsApp
                    </button>
                    <button 
                        onClick={shareOnGmail}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded mt-4"
                    >
                        Share via Gmail
                    </button>
                    <button 
                        onClick={() => setModalIsOpen(false)} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded mt-4"
                    >
                        Close
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default StudentList;
