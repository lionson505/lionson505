import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddSportsProfessionalForm from '../components/forms/AddSportsProfessionalForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { DataTable } from '../components/ui/DataTable';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';

const SportsProfessionals = () => {
  const [activeTab, setActiveTab] = useState('All 87');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Initial data
  const initialProfessionals = [
    {
      id: '#1',
      avatar: '/avatars/jackson.jpg',
      name: 'Jackson NTARINDWA',
      username: '@jackson.ntarindwa',
      phone: '0784704515',
      function: 'Coach',
      subFunction: 'Amavubi',
      status: 'Active',
      nationality: 'Rwandan',
      region: 'Cameroon',
      count: '+1'
    }
  ];

  // Table columns configuration
  const columns = [
    { key: 'name', header: 'NAME' },
    { key: 'id', header: 'ID' },
    { key: 'phone', header: 'PHONE' },
    { key: 'function', header: 'FUNCTION' },
    { key: 'status', header: 'STATUS' },
    { key: 'nationality', header: 'NATIONALITY' }
  ];

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Inactive', 'Suspended'],
    function: ['Coach', 'Player', 'Referee'],
    nationality: ['Rwandan', 'Foreign']
  };

  const tabs = ['All 87', 'Manage Sports Professionals', 'Add new', 'Manage Discipline', 'Manage function'];

  // Simulate initial data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load professionals. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProfessional = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Professional added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add professional'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (professional) => {
    setSelectedProfessional(professional);
    setShowAddModal(true);
  };

  const handleDelete = async (professional) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Professional deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete professional'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (professional) => {
    toast.success('Download started');
  };

  // Custom row renderer for the DataTable
  const renderRow = (professional) => (
    <tr key={professional.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={professional.avatar} 
            alt={professional.name} 
            className="h-8 w-8 rounded-full"
          />
          <div>
            <div className="font-medium">{professional.name}</div>
            <div className="text-sm text-gray-500">{professional.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{professional.id}</td>
      <td className="px-6 py-4">{professional.phone}</td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium">{professional.function}</div>
          <div className="text-sm text-gray-500">{professional.subFunction}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          professional.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {professional.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span>{professional.nationality}</span>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
            {professional.region}
          </span>
          <span className="text-xs text-gray-500">
            {professional.count}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <ActionMenu
          onEdit={() => handleEdit(professional)}
          onDelete={() => handleDelete(professional)}
          onDownload={() => handleDownload(professional)}
        />
      </td>
    </tr>
  );

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="p-6">
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sports Professionals</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
          <span>Add Professional</span>
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
        data={initialProfessionals}
        columns={columns}
        filterConfig={filterConfig}
        searchKeys={['name', 'id', 'phone', 'function']}
        renderRow={renderRow}
        actions={true}
      />

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Professional"
        message={`Are you sure you want to delete ${selectedProfessional?.name}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedProfessional(null);
          }
        }}
        title={selectedProfessional ? "Edit Professional" : "Add Professional"}
      >
        <AddSportsProfessionalForm
          initialData={selectedProfessional}
          onSubmit={handleAddProfessional}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedProfessional(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default SportsProfessionals; 