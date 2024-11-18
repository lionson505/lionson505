import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddNationalTeamForm from '../components/forms/AddNationalTeamForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { DataTable } from '../components/ui/DataTable';
import { toast } from 'react-hot-toast';

const NationalTeams = () => {
  const [activeTab, setActiveTab] = useState('All 87');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Initial data
  const initialTeams = [
    {
      id: '#1',
      teamName: 'AMAVUBI CAN Qualifier',
      month: 'MARCH 2021',
      status: 'Active',
      federation: 'RWANDA FOOTBALL ASSOCIATION FEDERATION',
      players: 23
    },
    // ... other teams
  ];

  // Table columns configuration
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'teamName', header: 'TEAM NAME' },
    { key: 'month', header: 'MONTH' },
    { key: 'status', header: 'STATUS' },
    { key: 'federation', header: 'FEDERATION' },
    { key: 'players', header: 'PLAYERS' }
  ];

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Suspended'],
    federation: ['RWANDA FOOTBALL ASSOCIATION FEDERATION', 'NATIONAL PARALYMPIC COMMITTEE'],
    month: ['MARCH 2021', 'APRIL 2021']
  };

  const tabs = ['All 87', 'Manage National Teams', 'Add National Team', 'Manage Players', 'Players & Appearances'];

  const handleAddTeam = async (data) => {
    try {
      // API call would go here
      console.log('Adding team:', data);
      setShowAddModal(false);
      toast.success('Team added successfully');
    } catch (error) {
      toast.error('Failed to add team');
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowAddModal(true);
  };

  const handleDelete = (team) => {
    setSelectedTeam(team);
    setShowDeleteDialog(true);
  };

  const handleDownload = (team) => {
    console.log('Downloading:', team);
    toast.success('Download started');
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting team:', selectedTeam);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  // Custom row renderer for the DataTable
  const renderRow = (team) => (
    <tr key={team.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">{team.id}</td>
      <td className="px-6 py-4">{team.teamName}</td>
      <td className="px-6 py-4">{team.month}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          team.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {team.status}
        </span>
      </td>
      <td className="px-6 py-4">{team.federation}</td>
      <td className="px-6 py-4">{team.players}</td>
      <td className="px-6 py-4">
        <ActionMenu
          onEdit={() => handleEdit(team)}
          onDelete={() => handleDelete(team)}
          onDownload={() => handleDownload(team)}
        />
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage National Team</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add National Team</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* DataTable Component */}
      <DataTable
        data={initialTeams}
        columns={columns}
        filterConfig={filterConfig}
        searchKeys={['teamName', 'id', 'federation']}
        renderRow={renderRow}
        actions={true}
      />

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Team"
        message={`Are you sure you want to delete ${selectedTeam?.teamName}? This action cannot be undone.`}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedTeam(null);
        }}
        title={selectedTeam ? "Edit Team" : "Add National Team"}
      >
        <AddNationalTeamForm
          initialData={selectedTeam}
          onSubmit={handleAddTeam}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedTeam(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default NationalTeams; 