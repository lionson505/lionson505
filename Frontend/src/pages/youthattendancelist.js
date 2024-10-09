import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";

function TYouthAttendanceList() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [youthData, setYouthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatePage, setUpdatePage] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(22);
  const [totalsToday, setTotalsToday] = useState({ present: 0, absent: 0, saved: 0 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchAttendanceData();
    fetchYouthData();
  }, [updatePage]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("http://localhost:4000/api/attendance");
      if (!response.ok) throw new Error("Failed to fetch attendance data");
      const data = await response.json();
      setAttendanceRecords(data);
      updateStatusCounts(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchYouthData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("http://localhost:4000/api/youth");
      if (!response.ok) throw new Error("Failed to fetch youth data");
      const data = await response.json();
      setYouthData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusCounts = (records) => {
    const counts = {};
    records.forEach(record => {
      const date = new Date(record.date).toLocaleDateString();
      if (!counts[date]) {
        counts[date] = { present: 0, absent: 0, saved: 0 };
      }
      if (record.status === 'present') counts[date].present++;
      else if (record.status === 'absent') counts[date].absent++;
      else if (record.status === 'saved') counts[date].saved++;
    });
    setStatusCounts(counts);
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isBirthdayToday = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
  };

  const combinedRecords = attendanceRecords.map(record => {
    const youth = youthData.find(y => y._id === record.youthId._id);
    return {
      ...record,
      youthFirstName: youth ? youth.firstName : 'Unknown',
      youthLastName: youth ? youth.lastName : 'Unknown',
      youthBirthday: youth ? new Date(youth.birthday).toLocaleDateString() : 'Unknown',
    };
  });

  const filteredRecords = combinedRecords.filter(record => {
    const age = calculateAge(record.youthBirthday);
    const isToday = new Date(record.date).toLocaleDateString() === new Date().toLocaleDateString();
    return (
      isToday &&
      (record.youthFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.youthLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      isBirthdayToday(record.youthBirthday)) &&
      age >= minAge && age <= maxAge
    );
  });

  const calculateTotalsForToday = () => {
    const today = new Date().toLocaleDateString();
    const totals = { present: 0, absent: 0, saved: 0 };
    
    filteredRecords.forEach(record => {
      if (new Date(record.date).toLocaleDateString() === today) {
        if (record.status === 'present') totals.present++;
        else if (record.status === 'absent') totals.absent++;
        else if (record.status === 'saved') totals.saved++;
      }
    });

    setTotalsToday(totals);
  };

  useEffect(() => {
    calculateTotalsForToday();
  }, [filteredRecords, minAge, maxAge]);

  const handleDateClick = (date) => {
    const dailyAttendance = combinedRecords.filter(record => new Date(record.date).toLocaleDateString() === date);
    setDailyRecords(dailyAttendance);
    setSelectedDate(date);
    setModalSearchQuery("");
  };

  const handleCloseDetails = () => {
    setSelectedDate(null);
    setDailyRecords([]);
  };

  const filteredDailyRecords = dailyRecords.filter(record =>
    record.youthFirstName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    record.youthLastName.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  const ageRanges = [
    { label: "0-2", min: 0, max: 2 },
    { label: "3-5", min: 3, max: 5 },
    { label: "6-12", min: 6, max: 12 },
    { label: "13-17", min: 13, max: 17 },
    { label: "18-22", min: 18, max: 22 },
    { label: "All", min: 0, max: 22 }
  ];

  const handleAgeRangeClick = (min, max) => {
    setMinAge(min);
    setMaxAge(max);
    setSearchQuery(""); // Reset search query
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        
        <div className="flex justify-between pt-5 pb-3 px-3">
          <span className="font-bold text-lg">Attendance Records</span>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={() => {
                setUpdatePage(!updatePage);
                calculateTotalsForToday(); // Recalculate totals on refresh
              }}
            >
              Refresh Records
            </button>
          </div>
        </div>

        <div className="px-3">
          <input
            type="text"
            placeholder="Search by name or birthday..."
            className="border border-gray-300 rounded p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4 px-3">
          {ageRanges.map((range) => (
            <button
              key={range.label}
              className="border border-gray-300 rounded p-2"
              onClick={() => handleAgeRangeClick(range.min, range.max)}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="px-3">
          <h3 className="font-bold">Totals for Today:</h3>
          <p>Present: {totalsToday.present}</p>
          <p>Absent: {totalsToday.absent}</p>
          <p>Saved: {totalsToday.saved}</p>
        </div>

        {loading ? (
          <div className="flex justify-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth First Name</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth Last Name</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Birthday</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Attendance Status</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record._id}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{record.youthFirstName}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.youthLastName}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.youthBirthday}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.status}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedDate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 w-11/12 max-w-lg">
              <h3 className="text-lg font-bold mb-3">Attendance for {selectedDate}</h3>
              <button className="mb-4 text-red-500" onClick={handleCloseDetails}>Close</button>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search in daily records..."
                  className="border border-gray-300 rounded p-2 w-full"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
                <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth First Name</th>
                      <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth Last Name</th>
                      <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Birthday</th>
                      <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDailyRecords.length > 0 ? (
                      filteredDailyRecords.map(record => (
                        <tr key={record._id}>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-900">{record.youthFirstName}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.youthLastName}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.youthBirthday}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">No records for this date.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TYouthAttendanceList;
