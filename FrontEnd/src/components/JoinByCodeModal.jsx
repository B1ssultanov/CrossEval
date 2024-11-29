"use client";

import { useState } from "react";

export default function JoinByCodeModal({ isOpen, onClose, onJoin }) {
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  const handleJoin = () => {
    onJoin(inviteCode);
    setInviteCode("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Enter Course Code</h2>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter invite code"
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
