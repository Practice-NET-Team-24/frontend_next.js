"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Mock users list (replace with API later)
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com", role: "user" },
];

export default function SettingsPage() {
  const [users, setUsers] = useState(mockUsers);
  const [adminPassword, setAdminPassword] = useState("");

  const handlePasswordChange = () => {
    console.log("Admin password updated:", adminPassword);
    setAdminPassword("");
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    console.log(`Updated role for user ${id}: ${newRole}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <Card className="p-4 shadow-md space-y-4">
        {/* Change Admin Password */}
        <div>
          <span>Change Admin Password</span>
          <Input
            className="mt-3 mb-3"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="New Password"
          />
          <Button onClick={handlePasswordChange} className="mt-2">
            Save Password
          </Button>
        </div>

        {/* Manage User Roles */}
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Manage User Roles</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Change Role</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "user")}>
                          Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                          Set as Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
