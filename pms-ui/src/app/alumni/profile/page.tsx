'use client'
import React from 'react';
import {
  Button,
  Input,
  Spinner
} from "@heroui/react";
import { useAlumniProfile } from './components/useAlumniProfile';

const AlumniProfile = () => {
  const {
    profile,
    isEditing,
    loading,
    error,
    handleInputChange,
    setIsEditing,
    handleSubmit
  } = useAlumniProfile();


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Alumni Profile</h2>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button color="primary" onPress={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="ghost" color="warning" onPress={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-600">First Name</label>
                  {isEditing && (
                    <span className="text-xs text-gray-500">Required</span>
                  )}
                </div>
                <Input
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="bordered"
                  className="w-full bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={profile.middle_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Batch</label>
                <Input
                  id="batch"
                  name="batch"
                  value={profile.batch}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-600">Contact Details</label>
              </div>
              <div className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="bordered"
                  className="w-full"
                />
                <Input
                  id="alt_email"
                  name="alt_email"
                  type="email"
                  value={profile.alt_email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="bordered"
                  placeholder="Secondary Email"
                  className="w-full"
                />
                <Input
                  id="phone"
                  name="phone"
                  value={profile.ph_no}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="bordered"
                  className="w-full"
                />
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Current Work</h3>
              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <Input
                  id="company"
                  name="company"
                  value={profile.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                <Input
                  id="designation"
                  name="designation"
                  value={profile.designation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Address Information</h3>
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <Input
                  id="city"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <Input
                  id="state"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;