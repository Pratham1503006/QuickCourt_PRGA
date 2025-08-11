import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportsSection = ({ reports, onUpdateStatus, onViewDetails }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports?.filter(report => {
    const matchesSearch = report?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         report?.reportedBy?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      investigating: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Investigating' },
      resolved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' },
      dismissed: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Dismissed' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      high: { icon: 'AlertTriangle', color: 'text-red-500' },
      medium: { icon: 'AlertCircle', color: 'text-yellow-500' },
      low: { icon: 'Info', color: 'text-blue-500' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    return <Icon name={config?.icon} size={16} className={config?.color} />;
  };

  const getCategoryIcon = (category) => {
    const categoryConfig = {
      'User Complaint': 'User',
      'Facility Issue': 'Building',
      'Payment Dispute': 'CreditCard',
      'Technical Problem': 'Bug',
      'Policy Violation': 'Shield',
      'Other': 'HelpCircle'
    };
    
    return categoryConfig?.[category] || 'HelpCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-card-foreground">Reports & Complaints</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              type="search"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {filteredReports?.map((report) => (
          <div key={report?.id} className="p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon name={getCategoryIcon(report?.category)} size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-semibold text-card-foreground">{report?.title}</h4>
                    {getPriorityIcon(report?.priority)}
                    {getStatusBadge(report?.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report?.category}</p>
                  <p className="text-sm text-card-foreground line-clamp-2">{report?.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Icon name="User" size={14} className="mr-1" />
                  {report?.reportedBy}
                </span>
                <span className="flex items-center">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  {formatDate(report?.createdAt)}
                </span>
                {report?.assignedTo && (
                  <span className="flex items-center">
                    <Icon name="UserCheck" size={14} className="mr-1" />
                    Assigned to {report?.assignedTo}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(report)}
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  View Details
                </Button>
                
                {report?.status === 'pending' && (
                  <select
                    onChange={(e) => onUpdateStatus(report?.id, e?.target?.value)}
                    className="px-3 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue=""
                  >
                    <option value="" disabled>Update Status</option>
                    <option value="investigating">Start Investigation</option>
                    <option value="resolved">Mark Resolved</option>
                    <option value="dismissed">Dismiss</option>
                  </select>
                )}
                
                {report?.status === 'investigating' && (
                  <select
                    onChange={(e) => onUpdateStatus(report?.id, e?.target?.value)}
                    className="px-3 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue=""
                  >
                    <option value="" disabled>Update Status</option>
                    <option value="resolved">Mark Resolved</option>
                    <option value="dismissed">Dismiss</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredReports?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reports found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;