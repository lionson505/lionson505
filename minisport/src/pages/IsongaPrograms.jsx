import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddIsongaProgramForm from '../components/forms/AddIsongaProgramForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';

const IsongaPrograms = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('All 87');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Initial data
  const initialPrograms = [
    {
      id: '#1',
      name: 'AMAVUBI CAN Qualifier',
      month: 'MARCH 2021',
      status: 'Active',
      category: 'Football',
      participants: 23,
      location: 'Amahoro Stadium',
      coordinator: 'KAMANZI Eric'
    },
    {
      id: '#2',
      name: 'Basketball Development',
      month: 'APRIL 2021',
      status: 'Completed',
      category: 'Basketball',
      participants: 45,
      location: 'BK Arena',
      coordinator: 'MUGISHA Jean'
    }
  ];

  const [programs, setPrograms] = useState(initialPrograms);

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Completed', 'Cancelled'],
    category: ['Football', 'Basketball', 'Volleyball', 'Athletics'],
    location: ['Amahoro Stadium', 'BK Arena', 'Kigali Arena']
  };

  const tabs = ['All 87', 'Manage Programs', 'Add Program', 'Manage Students', 'Transfer Students'];

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load programs. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProgram = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Program added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add program'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setShowAddModal(true);
  };

  const handleDelete = async (program) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Program deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete program'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (program) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(programs.map(program => program.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Isonga Programs
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs..."
              className={`pl-10 pr-4 py-2 border rounded-lg w-64 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            disabled={isSubmitting}
          >
            <Plus className="h-5 w-5" />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedRows.length === programs.length}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>PROGRAM NAME</TableHead>
              <TableHead>MONTH</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>PARTICIPANTS</TableHead>
              <TableHead>COORDINATOR</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(program.id)}
                    onChange={() => handleSelectRow(program.id)}
                  />
                </TableCell>
                <TableCell>{program.id}</TableCell>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.month}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    program.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {program.status}
                  </span>
                </TableCell>
                <TableCell>{program.category}</TableCell>
                <TableCell>{program.location}</TableCell>
                <TableCell>{program.participants}</TableCell>
                <TableCell>{program.coordinator}</TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(program)}
                    onDelete={() => handleDelete(program)}
                    onDownload={() => handleDownload(program)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Program"
        message={`Are you sure you want to delete ${selectedProgram?.name}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedProgram(null);
          }
        }}
        title={selectedProgram ? "Edit Program" : "Add Program"}
      >
        <AddIsongaProgramForm
          initialData={selectedProgram}
          onSubmit={handleAddProgram}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedProgram(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default IsongaPrograms; 