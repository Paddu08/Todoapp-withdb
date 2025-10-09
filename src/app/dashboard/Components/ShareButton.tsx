"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareButtonProps {
  taskId: number;
  users: { userId: number; name: string }[];
    currentUserId: number; 
}

export default function ShareButton({ taskId, users ,currentUserId}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [shareWith, setShareWith] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<{ userId: number; name: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShareWith(value);
    setSelectedUserId(null); // reset selected user

    if (!value) {
      setFilteredUsers([]);
      return;
    }

    const filtered = users
    .filter((user) => user.userId !== currentUserId)
    .filter((user) =>
        
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelect = (user: { userId: number; name: string }) => {
    setShareWith(user.name);
    setSelectedUserId(user.userId);
    setFilteredUsers([]);
  };

  const handleShare = () => {
    if (!selectedUserId) return;
    console.log(`Sharing task ${taskId} with userId ${selectedUserId} (${shareWith})`);
    // TODO: Call your API with taskId and selectedUserId
    setOpen(false);
    setShareWith("");
    setSelectedUserId(null);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Share</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Input
              placeholder="Enter user name Ex jarvis(6)"
              value={shareWith}
              onChange={handleChange}
              
            />

            {/* Autocomplete dropdown */}
            {filteredUsers.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                {filteredUsers.map((user) => (
                  <li
                    key={user.userId}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(user)}
                  >
                    {user.name} ({user.userId})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleShare} disabled={!selectedUserId}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
