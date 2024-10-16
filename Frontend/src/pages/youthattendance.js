import React, { useState, useEffect, useContext } from "react";
import AddYouth from "../components/AddYouth";
import AuthContext from "../AuthContext";

function TYouthAttendance() {
  const [showYouthModal, setShowYouthModal] = useState(false);
  const [youths, setYouthsData] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [ageRange, setAgeRange] = useState({ min: 0, max: 22 });
  const [attendanceTotals, setAttendanceTotals] = useState({ present: 0, absent: 0, saved: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [attendancePublished, setAttendancePublished] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchYouthData();
  }, [updatePage]);

  useEffect(() => {
    calculateAttendanceTotals();
  }, [youths]);

  const fetchYouthData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`https://netcompassion-backend.onrender.com/api/youth`);
      if (!response.ok) throw new Error("Failed to fetch youth data");
      const data = await response.json();
      setYouthsData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendanceTotals = () => {
    const totals = youths.reduce(
      (acc, youth) => {
        if (youth.attendance === 'present') acc.present++;
        if (youth.attendance === 'absent') acc.absent++;
        if (youth.attendance === 'saved') acc.saved++;
        return acc;
      },
      { present: 0, absent: 0, saved: 0 }
    );
    setAttendanceTotals(totals);
  };

  const toggleYouthModal = () => {
    setShowYouthModal(!showYouthModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage((prev) => !prev);
  };

  const handleAttendanceChange = (youthId, status) => {
    setYouthsData((prevYouths) =>
      prevYouths.map((youth) => ({
        ...youth,
        attendance: youth._id === youthId ? status : youth.attendance,
      }))
    );
  };

  const saveAttendance = async () => {
    const attendanceData = youths
      .map((youth) => {
        if (youth.attendance) {
          return {
            youthId: youth._id,
            status: youth.attendance,
            date: new Date().toISOString(),
            userId: authContext.user,
            compassion:authContext.user.compassion
          };
        }
        return null;
      })
      .filter(Boolean);

    if (attendanceData.length === 0) {
      alert('No attendance data to save. Please select attendance for at least one youth.');
      return;
    }

    // Check if today is Saturday
    const today = new Date();
    const isSaturday = today.getDay() === 6; // 6 represents Saturday

    if (!isSaturday) {
      alert('Attendance can only be saved on Saturdays.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://netcompassion-backend.onrender.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) throw new Error('Failed to save attendance data');

      const result = await response.json();
      console.log('Attendance saved successfully:', result);
      alert('Attendance saved successfully!');
      setAttendancePublished(true); // Mark attendance as published
      setUpdatePage((prev) => !prev);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredYouths = youths.filter((youth) => {
    const age = new Date().getFullYear() - new Date(youth.birthday).getFullYear();
    const matchesAgeRange = age >= ageRange.min && age <= ageRange.max;
    const matchesSearchQuery = youth.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                youth.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgeRange && matchesSearchQuery;
  });

  const ageRanges = [
    { label: '0-2 years', min: 0, max: 2 },
    { label: '3-5 years', min: 3, max: 5 },
    { label: '6-10 years', min: 6, max: 10 },
    { label: '11-15 years', min: 11, max: 15 },
    { label: '16-20 years', min: 16, max: 20 },
    { label: '21-22 years', min: 21, max: 22 },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showYouthModal && (
          <AddYouth
            toggleYouthModal={toggleYouthModal}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        
        {/* Header */}
        <div className="flex justify-between pt-5 pb-3 px-3">
          <span className="font-bold">Youth Management</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
            onClick={toggleYouthModal}
          >
            Add Youth
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 px-3">
          <input
            type="text"
            placeholder="Search by first or last name..."
            className="border border-gray-300 rounded p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Age Range Buttons */}
        <div className="flex space-x-2 mb-4">
          {ageRanges.map((range) => (
            <button
              key={range.label}
              className={`p-2 rounded ${ageRange.min === range.min && ageRange.max === range.max ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setAgeRange({ min: range.min, max: range.max })}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Attendance Totals */}
        <div className="mb-4">
          <span>Total Present: {attendanceTotals.present}</span>
          <span className="ml-4">Total Absent: {attendanceTotals.absent}</span>
          <span className="ml-4">Total Saved: {attendanceTotals.saved}</span>
        </div>

        {/* Save Attendance Button */}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs rounded mb-3"
          onClick={saveAttendance}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
        
        {/* Publish Attendance Status */}
        {attendancePublished && (
          <div className="text-green-500 mb-4">Attendance has been published for this week!</div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">First Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Last Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Birthday</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Address</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Education Level</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredYouths.map((youth) => (
                <tr key={youth._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">{youth.firstName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.lastName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(youth.birthday).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.address}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.educationLevel}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex space-x-2">
                    {['present', 'absent', 'saved'].map(status => (
                      <label key={status}>
                        <input
                          type="radio"
                          name={`attendance-${youth._id}`}
                          checked={youth.attendance === status}
                          onChange={() => handleAttendanceChange(youth._id, status)}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </label>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TYouthAttendance;
