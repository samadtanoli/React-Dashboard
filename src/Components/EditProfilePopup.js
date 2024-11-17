import React from 'react';
import { Modal, Input, Button } from 'antd';

const EditProfilePopup = ({ showEditPopup, newUsername, setNewUsername, handleSaveEdit, setShowEditPopup }) => {
  return (
    <Modal
      title="Edit Profile"
      visible={showEditPopup}
      onCancel={() => setShowEditPopup(false)}
      footer={null}
      centered
    >
      {/* Username Edit Field */}
      <Input
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Enter new username"
        className="mb-4"
      />
      {/* Save Button */}
      <Button
        type="primary"
        onClick={handleSaveEdit}
        block
      >
        Save
      </Button>
    </Modal>
  );
};

export default EditProfilePopup;
