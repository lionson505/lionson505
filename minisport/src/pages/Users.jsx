import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook to get token

function Users() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [error, setError] = useState(null);

  const { token } = useAuth(); // Get token from AuthContext
  console.log("lionson",token)

  // Filter and pagination logic (same as before)
  const filteredData = usersData.filter(user => {
    const matchesSearch = Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesGroup = !selectedGroup || selectedGroup === "All Groups" || user.group === selectedGroup;
    const matchesStatus = !selectedStatus || selectedStatus === "All" || user.status === selectedStatus;
    const matchesName = !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());
    return matchesSearch && matchesGroup && matchesStatus && matchesName;
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const totalEntries = filteredData.length;
  const firstEntry = totalEntries === 0 ? 0 : startIndex + 1;
  const lastEntry = Math.min(startIndex + entriesPerPage, totalEntries);

  const fetchUsersData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://mis.minisports.gov.rw/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }

      const data = await response.json();
      setUsersData(data); 
    } catch (error) {
      setError('Failed to load users data. Please try again later.');
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [token]); 


  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedUser) => {
    setUsersData(prev =>
      prev.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setIsEditModalOpen(false);
    toast.success('User updated successfully');
  };

  const handleAddUser = (newUser) => {
    setUsersData(prev => [...prev, newUser]);
    setIsAddModalOpen(false);
    toast.success('User added successfully');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600">Loading users data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button
          onClick={fetchUsersData} // Retry fetching data
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Render content (same as before)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>
      {/* Filter & Table logic... */}

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSubmit}
        userData={selectedUser}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
}

export default Users;
