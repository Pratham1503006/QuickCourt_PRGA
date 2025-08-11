import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

const TimeSlotManager = ({ court, onUpdateCourt }) => {
  const [activeTab, setActiveTab] = useState('availability');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(court.maintenanceSchedule || []);
  const [newMaintenanceSlot, setNewMaintenanceSlot] = useState({
    day: 'monday',
    startTime: '08:00',
    endTime: '10:00',
    description: '',
    recurring: true
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const operatingHours = court.operatingHours[dayOfWeek];
    
    if (!operatingHours || !operatingHours.isOpen) {
      return [];
    }

    const slots = [];
    const startHour = parseInt(operatingHours.open.split(':')[0]);
    const startMinute = parseInt(operatingHours.open.split(':')[1]);
    const endHour = parseInt(operatingHours.close.split(':')[0]);
    const endMinute = parseInt(operatingHours.close.split(':')[1]);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const nextHour = currentMinute === 30 ? currentHour + 1 : currentHour;
      const nextMinute = currentMinute === 30 ? 0 : 30;
      const nextTimeString = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;
      
      if (nextHour < endHour || (nextHour === endHour && nextMinute <= endMinute)) {
        slots.push({
          id: `${selectedDate}_${timeString}`,
          time: `${timeString} - ${nextTimeString}`,
          startTime: timeString,
          endTime: nextTimeString,
          isBlocked: blockedSlots.includes(`${selectedDate}_${timeString}`),
          isBooked: Math.random() > 0.7, // Simulate some bookings
          isMaintenance: isMaintenanceTime(dayOfWeek, timeString)
        });
      }

      if (currentMinute === 30) {
        currentHour++;
        currentMinute = 0;
      } else {
        currentMinute = 30;
      }
    }

    return slots;
  };

  const isMaintenanceTime = (dayOfWeek, timeString) => {
    return maintenanceSchedule.some(maintenance => {
      if (maintenance.day !== dayOfWeek) return false;
      const [startTime, endTime] = maintenance.time.split('-');
      return timeString >= startTime && timeString < endTime;
    });
  };

  const timeSlots = generateTimeSlots();

  const handleSlotToggle = (slotId) => {
    setBlockedSlots(prev => 
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleAddMaintenance = () => {
    if (!newMaintenanceSlot.description.trim()) {
      alert('Please enter a maintenance description');
      return;
    }

    const maintenance = {
      id: Date.now().toString(),
      day: newMaintenanceSlot.day,
      time: `${newMaintenanceSlot.startTime}-${newMaintenanceSlot.endTime}`,
      description: newMaintenanceSlot.description,
      recurring: newMaintenanceSlot.recurring
    };

    setMaintenanceSchedule(prev => [...prev, maintenance]);
    setNewMaintenanceSlot({
      day: 'monday',
      startTime: '08:00',
      endTime: '10:00',
      description: '',
      recurring: true
    });
  };

  const handleRemoveMaintenance = (maintenanceId) => {
    setMaintenanceSchedule(prev => prev.filter(m => m.id !== maintenanceId));
  };

  const handleSaveChanges = () => {
    onUpdateCourt({
      ...court,
      maintenanceSchedule
    });
  };

  const generateNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const tabs = [
    { id: 'availability', label: 'Daily Availability', icon: 'Calendar' },
    { id: 'maintenance', label: 'Maintenance Schedule', icon: 'Wrench' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Daily Time Slots</h3>
              <div className="flex items-center space-x-3">
                <Select
                  options={generateNextWeekDates()}
                  value={selectedDate}
                  onChange={setSelectedDate}
                  label="Select Date"
                />
              </div>
            </div>

            {timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Court is closed on this day</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        slot.isMaintenance
                          ? 'bg-yellow-50 border-yellow-200 cursor-not-allowed'
                          : slot.isBooked
                          ? 'bg-red-50 border-red-200 cursor-not-allowed'
                          : slot.isBlocked
                          ? 'bg-gray-100 border-gray-300'
                          : 'bg-green-50 border-green-200 hover:bg-green-100'
                      }`}
                      onClick={() => !slot.isBooked && !slot.isMaintenance && handleSlotToggle(slot.id)}
                    >
                      <div className="text-sm font-medium text-card-foreground mb-1">
                        {slot.time}
                      </div>
                      <div className="text-xs">
                        {slot.isMaintenance ? (
                          <span className="text-yellow-700">Maintenance</span>
                        ) : slot.isBooked ? (
                          <span className="text-red-700">Booked</span>
                        ) : slot.isBlocked ? (
                          <span className="text-gray-600">Blocked</span>
                        ) : (
                          <span className="text-green-700">Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span>Blocked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                      <span>Maintenance</span>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => setBlockedSlots([])}>
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Clear All Blocks
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Add New Maintenance */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Add Maintenance Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Day of Week"
                options={daysOfWeek.map(day => ({ value: day.key, label: day.label }))}
                value={newMaintenanceSlot.day}
                onChange={(value) => setNewMaintenanceSlot(prev => ({ ...prev, day: value }))}
              />

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newMaintenanceSlot.startTime}
                    onChange={(e) => setNewMaintenanceSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-card-foreground mb-2">End Time</label>
                  <input
                    type="time"
                    value={newMaintenanceSlot.endTime}
                    onChange={(e) => setNewMaintenanceSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Maintenance Description"
                  type="text"
                  value={newMaintenanceSlot.description}
                  onChange={(e) => setNewMaintenanceSlot(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Deep cleaning, equipment maintenance, etc."
                />
              </div>

              <div className="md:col-span-2">
                <Checkbox
                  label="Recurring weekly"
                  checked={newMaintenanceSlot.recurring}
                  onChange={(checked) => setNewMaintenanceSlot(prev => ({ ...prev, recurring: checked }))}
                />
              </div>
            </div>

            <Button onClick={handleAddMaintenance}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Maintenance Slot
            </Button>
          </div>

          {/* Current Maintenance Schedule */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Current Maintenance Schedule</h3>
            
            {maintenanceSchedule.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Wrench" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No maintenance schedules set</p>
              </div>
            ) : (
              <div className="space-y-3">
                {maintenanceSchedule.map((maintenance) => (
                  <div key={maintenance.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-card-foreground">
                        {daysOfWeek.find(d => d.key === maintenance.day)?.label} • {maintenance.time}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {maintenance.description}
                      </div>
                      {maintenance.recurring && (
                        <div className="text-xs text-primary mt-1">Recurring weekly</div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveMaintenance(maintenance.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Changes */}
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>
              <Icon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotManager;
