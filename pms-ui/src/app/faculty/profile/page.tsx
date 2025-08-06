'use client'
import React from 'react';
import {
  Input,
  Button,
  Select,
  SelectItem,
  Spinner
} from "@heroui/react";
import { useFacultyProfile } from './components/useFacultyProfile';

const Profile = () => {
  const {
    profile,
    isEditing,
    isLoading,
    handleInputChange,
    handleSelectChange,
    setIsEditing,
    updateProfile
  } = useFacultyProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Faculty Profile</h2>
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
                  <Button color="primary" onPress={updateProfile}>
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
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <Select
                  id="gender"
                  name="gender"
                  selectedKeys={[profile.gender]}
                  onChange={(e) => handleSelectChange('gender', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                >
                  <SelectItem key="Male">Male</SelectItem>
                  <SelectItem key="Female">Female</SelectItem>
                  <SelectItem key="Other">Other</SelectItem>
                </Select>
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
              </div>
            </div>

            {/* Department Information
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Department Information</h3>
              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <Select
                  id="department"
                  name="department"
                  selectedKeys={[profile.department]}
                  onChange={(e) => handleSelectChange('department', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                >
                  <SelectItem key="Computer Science">Computer Science</SelectItem>
                  <SelectItem key="Management">Management</SelectItem>
                  <SelectItem key="Commerce">Commerce</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                <Select
                  id="designation"
                  name="designation"
                  selectedKeys={[profile.designation]}
                  onChange={(e) => handleSelectChange('designation', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                >
                  <SelectItem key="Professor">Professor</SelectItem>
                  <SelectItem key="Associate Professor">Associate Professor</SelectItem>
                  <SelectItem key="Assistant Professor">Assistant Professor</SelectItem>
                </Select>
              </div>
            </div> */}

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

export default Profile;