"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { set } from "zod";

interface Ticket {
  id: number;
  placeId: number;
  sessionId: number;
  userId: number;
  rowNumber: number;
  seatNumber: number;
  createdAt: string;
}

interface Session {
  id: number;
  movieId: number;
  dateTimeStart: string;
}

interface Movie {
  id: number;
  name: string;
}





export default function ClientPage() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [tickets, setTickets] = useState<{ ticket: Ticket; movieName: string; sessionStart: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const router = useRouter();

  // Отримуємо список бронювань
  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        // Step 1: Fetch all tickets
        const ticketRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/Tickets`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketData = await ticketRes.json();

        if (!ticketData?.$values) return;
        const ticketsList: Ticket[] = ticketData.$values;

        // Step 2: Fetch all sessions in parallel
        const sessionRequests = ticketsList.map((ticket) =>
          fetch(`${NEXT_PUBLIC_API_URL}/api/Sessions/${ticket.sessionId}`).then((res) => res.json())
        );
        const sessionData: Session[] = await Promise.all(sessionRequests);

        // Step 3: Fetch all movies in parallel
        const movieRequests = sessionData.map((session) =>
          fetch(`${NEXT_PUBLIC_API_URL}/api/Movies/${session.movieId}`).then((res) => res.json())
        );
        const movieData: Movie[] = await Promise.all(movieRequests);

        // Step 4: Combine tickets, session start times, and movie names
        const enrichedTickets = ticketsList.map((ticket, index) => ({
          ticket,
          movieName: movieData[index]?.name || "Unknown",
          sessionStart: sessionData[index]?.dateTimeStart || "Unknown",
        }));

        setTickets(enrichedTickets);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Функція для скасування бронювання
  // const cancelBooking = async (bookingId: number) => {
  //   try {
  //     const response = await fetch(`/api/bookings/${bookingId}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) throw new Error("Failed to cancel booking");

  //     setBookings(bookings.filter((b) => b.id !== bookingId));
  //   } catch (error) {
  //     console.error("Error canceling booking:", error);
  //   }
  // };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/client/login");
  };


  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>

      {loading && <p>Loading...</p>}

      {tickets.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Film</TableHead>
              <TableHead>Session</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket, index) => (
              <TableRow key={index}>
                <TableCell>{ticket.movieName}</TableCell>
                <TableCell>{new Date(ticket.sessionStart).toLocaleTimeString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}</TableCell>
                <TableCell>
                  {/* <Button variant="outline" onClick={() => router.push(`/client/film/${ticket.}`)}>
                    View
                  </Button>
                  <Button variant="destructive" className="ml-2" onClick={() => cancelBooking(booking.id)}>
                    Cancel
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No bookings found.</p>
      )}

      {/* <Button className="mt-6" variant="outline" onClick={handleLogout}>
        Logout
      </Button> */}
    </Card>
  );
}
