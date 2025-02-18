"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ClientPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Отримуємо список бронювань
  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then(setBookings)
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  // Функція для скасування бронювання
  const cancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      setBookings(bookings.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/client/login");
  };
  

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {bookings.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Film</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.film.name}</TableCell>
                <TableCell>{booking.session.time}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => router.push(`/client/film/${booking.film.id}`)}>
                    View
                  </Button>
                  <Button variant="destructive" className="ml-2" onClick={() => cancelBooking(booking.id)}>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No bookings found.</p>
      )}

      <Button className="mt-6" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </Card>
  );
}
