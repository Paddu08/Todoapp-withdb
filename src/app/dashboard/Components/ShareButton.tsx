"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { shareTaskAction } from "@/lib/actions/shareTask";
import { Checkbox } from "@/components/ui/checkbox";
import { createPublicTaskLink } from "@/lib/actions/publicTaskLink";

interface ShareButtonProps {
  taskId: number;
  users: { userId: number; name: string }[];
  currentUserId: number;
}

export default function ShareButton({ taskId, users, currentUserId }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [shareWith, setShareWith] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<{ userId: number; name: string }[]>([]);
  const [isPublic, setIsPublic] = useState(false); // new state for public link

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShareWith(value);
    setSelectedUserId(null);

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

  const handleShare = async () => {
    try {
      if (isPublic) {
        // create public link
        const result = await createPublicTaskLink(taskId);
        alert(`Public link created:  (expires at ${result.expiresAt})`);
      } else {
        if (!selectedUserId) return;
        await shareTaskAction(taskId, selectedUserId);
        alert(`Task shared successfully with ${shareWith}`);
      }

      setOpen(false);
      setShareWith("");
      setSelectedUserId(null);
      setIsPublic(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Share</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {/* Checkbox for public link */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={isPublic} 
                onCheckedChange={(checked) => setIsPublic(!!checked)} 
              />
              <span>Share publicly (anyone with link can view)</span>
            </div>

            {/* Input only shown if not public */}
            {!isPublic && (
              <div className="relative">
                <Input
                  placeholder="Enter user name Ex jarvis(6)"
                  value={shareWith}
                  onChange={handleChange}
                />

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
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              onClick={()=>handleShare()} 
              disabled={!isPublic && !selectedUserId}
            >
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
