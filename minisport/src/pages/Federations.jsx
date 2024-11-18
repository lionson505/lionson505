import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X, MapPin, Users, Building2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddFederationForm from '../components/forms/AddFederationForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import ManageClubs from '../components/federation/ManageClubs';
import AddClubForm from '../components/federation/AddClubForm';

const Federations = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('Manage Federations');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // To track which form to show
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Initial data
  const initialFederations = [
    {
      id: '#1',
      name: 'Rwanda Football Federation',
      acronym: 'FERWAFA',
      logo: '/logos/ferwafa.svg',
      president: 'Jean Damascène SEKAMANA',
      clubs: 16,
      players: 450,
      staff: 32,
      location: 'Remera, Kigali',
      status: 'Active',
      type: 'Federation'
    },
    {
      id: '#2',
      name: 'Rwanda Basketball Federation',
      acronym: 'FERWABA',
      logo: '/logos/ferwaba.svg',
      president: 'Desire MUGWIZA',
      clubs: 12,
      players: 280,
      staff: 24,
      location: 'Remera, Kigali',
      status: 'Active',
      type: 'Federation'
    }
  ];

  const [federations, setFederations] = useState(initialFederations);

  // Define all available tabs
  const tabs = [
    'Manage Federations and associations',
    'Add Federation or association',
    'Manage Clubs',
    'Add Club',
    'Manage Players/Staff',
    'Add Player/Staff',
    'Player/Staff Transfer',
    'Player/Staff Transfer Report',
    'Players Map'
  ];

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Inactive', 'Suspended'],
    type: ['Federation', 'Association'],
    location: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load federations. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddFederation = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Federation added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add federation'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (federation) => {
    setSelectedItem(federation);
    setShowAddModal(true);
  };

  const handleDelete = async (federation) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Federation deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete federation'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (federation) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(federations.map(federation => federation.id));
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

  // Stats cards data
  const statsCards = [
    { icon: Building2, label: 'Total Federations', value: '12', color: 'bg-blue-100 text-blue-600' },
    { icon: Users, label: 'Total Players', value: '2,450', color: 'bg-green-100 text-green-600' },
    { icon: Users, label: 'Total Staff', value: '156', color: 'bg-purple-100 text-purple-600' },
    { icon: MapPin, label: 'Locations', value: '32', color: 'bg-orange-100 text-orange-600' },
  ];

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset states when changing tabs
    setSelectedItem(null);
    setShowAddModal(false);
    setShowDeleteDialog(false);
    
    // Set appropriate modal type based on tab
    switch(tab) {
      case 'Add Federation or association':
        setModalType('federation');
        setShowAddModal(true);
        break;
      case 'Add Club':
        setModalType('club');
        break;
      case 'Add Player/Staff':
        setModalType('playerStaff');
        setShowAddModal(true);
        break;
      case 'Player/Staff Transfer':
        setModalType('transfer');
        setShowAddModal(true);
        break;
      default:
        setModalType(null);
    }
  };

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Manage Federations and associations':
        return (
          <div className="space-y-6">
            {/* Federation Management Table */}
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedRows.length === federations.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>FEDERATION</TableHead>
                    <TableHead>PRESIDENT</TableHead>
                    <TableHead>CLUBS</TableHead>
                    <TableHead>PLAYERS</TableHead>
                    <TableHead>STAFF</TableHead>
                    <TableHead>LOCATION</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {federations.map((federation) => (
                    <TableRow key={federation.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedRows.includes(federation.id)}
                          onChange={() => handleSelectRow(federation.id)}
                        />
                      </TableCell>
                      <TableCell>{federation.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img 
                            src={federation.logo} 
                            alt={federation.name} 
                            className="h-8 w-8"
                          />
                          <div>
                            <div className="font-medium">{federation.name}</div>
                            <div className="text-sm text-gray-500">{federation.acronym}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{federation.president}</TableCell>
                      <TableCell>{federation.clubs}</TableCell>
                      <TableCell>{federation.players}</TableCell>
                      <TableCell>{federation.staff}</TableCell>
                      <TableCell>{federation.location}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          federation.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {federation.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionMenu
                          onEdit={() => handleEdit(federation)}
                          onDelete={() => handleDelete(federation)}
                          onDownload={() => handleDownload(federation)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      
      case 'Manage Clubs':
        return <ManageClubs 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={(club) => console.log('View details:', club)}
          onViewPlayers={(club) => console.log('View players:', club)}
        />;
      
      case 'Manage Players/Staff':
        return (
          <div className="space-y-6">
            {/* Players/Staff Management Table */}
            {/* Similar structure but with player/staff data */}
          </div>
        );
      
      case 'Player/Staff Transfer Report':
        return <PlayerTransferReport />;
      
      case 'Players Map':
        return (
          <div className="space-y-6">
            {/* Players Map Component */}
            {/* Add map visualization component here */}
          </div>
        );
      
      case 'Add Club':
        return (
          <div className="space-y-6">
            <AddClubForm
              onSubmit={handleAddClub}
              onCancel={() => setActiveTab('Manage Clubs')}
              isSubmitting={isSubmitting}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render appropriate form in modal based on modalType
  const renderForm = () => {
    switch(modalType) {
      case 'federation':
        return (
          <AddFederationForm
            initialData={selectedItem}
            onSubmit={handleAddFederation}
            onCancel={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSelectedItem(null);
              }
            }}
            isSubmitting={isSubmitting}
          />
        );
      
      case 'club':
        return (
          <AddClubForm
            initialData={selectedItem}
            onSubmit={handleAddClub}
            onCancel={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSelectedItem(null);
              }
            }}
            isSubmitting={isSubmitting}
          />
        );
      
      case 'playerStaff':
        return (
          <AddPlayerStaffForm
            initialData={selectedItem}
            onSubmit={handleAddPlayerStaff}
            onCancel={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSelectedItem(null);
              }
            }}
            isSubmitting={isSubmitting}
          />
        );
      
      case 'transfer':
        return (
          <PlayerTransferForm
            initialData={selectedItem}
            onSubmit={handleTransfer}
            onCancel={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSelectedItem(null);
              }
            }}
            isSubmitting={isSubmitting}
          />
        );
      
      default:
        return null;
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

      {/* Navigation Tabs */}
      <div className="mb-6 overflow-x-auto">
        <nav className="flex space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Content */}
      {renderContent()}

      {/* Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedItem(null);
          }
        }}
        title={selectedItem ? `Edit ${modalType}` : `Add ${modalType}`}
      >
        {renderForm()}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={`Delete ${modalType}`}
        message={`Are you sure you want to delete this ${modalType}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Federations; 