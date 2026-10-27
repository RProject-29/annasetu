import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Building, MapPin, Phone, UserCheck, Plus, CheckCircle2 } from 'lucide-react';

export const AddDestinationModal = ({
  isOpen,
  onClose,
  onAddDestination
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Night Shelter & Community Kitchen',
    address: '',
    contactPerson: '',
    contactPhone: '',
    capacityMeals: 200
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.contactPerson.trim() || !formData.contactPhone.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    onAddDestination({
      name: formData.name.trim(),
      type: formData.type,
      address: formData.address.trim(),
      contactPerson: formData.contactPerson.trim(),
      contactPhone: formData.contactPhone.trim(),
      capacityMeals: Number(formData.capacityMeals) || 200
    });

    setFormData({
      name: '',
      type: 'Night Shelter & Community Kitchen',
      address: '',
      contactPerson: '',
      contactPhone: '',
      capacityMeals: 200
    });
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Verified Distribution Hub / Shelter"
      subtitle="Register an approved night shelter, orphanage, or need zone for surplus food drop-off."
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {error && (
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger-text)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            Facility / Shelter Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Karuna Ashram Community Kitchen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', fontSize: '13px' }}
          />
        </div>

        <div className="responsive-2col">
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Facility Category *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: '100%', fontSize: '12px' }}
            >
              <option value="Night Shelter & Community Kitchen">Night Shelter & Community Kitchen</option>
              <option value="Registered Care Home">Registered Care Home / Orphanage</option>
              <option value="Admin-Approved Need Zone">Admin-Approved Need Zone</option>
              <option value="Slum Cluster Distribution Center">Slum Cluster Distribution Center</option>
              <option value="Elderly Care Home">Elderly Care Home</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Daily Meal Intake Capacity *
            </label>
            <input
              type="number"
              min="20"
              max="2000"
              value={formData.capacityMeals}
              onChange={(e) => setFormData({ ...formData, capacityMeals: e.target.value })}
              style={{ width: '100%', fontSize: '12px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            Complete Street Address & Landmark *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 45, 1st Cross, Near Metro Pillar 120, Indiranagar, Bengaluru"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: '100%', fontSize: '12px' }}
          />
        </div>

        <div className="responsive-2col">
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Coordinator / Contact Person *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sister Mary / Raju"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              style={{ width: '100%', fontSize: '12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98450 11223"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              style={{ width: '100%', fontSize: '12px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" icon={Plus}>
            Register Destination Hub
          </Button>
        </div>
      </form>
    </Modal>
  );
};
