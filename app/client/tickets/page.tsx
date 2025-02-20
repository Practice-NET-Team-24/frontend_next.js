"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import styles from "@/styles/TicketPage.module.css";
import { uk } from "date-fns/locale";

registerLocale("uk", uk);

export interface Session {
  id: number;
  movieId: number;
  hallId: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  price: number;
  reservedPlaces: number;
}

interface Seat {
  row: number;
  seat: number;
}

const seats: Seat[][] = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => ({
    row: row + 1,
    seat: col + 1,
  }))
);

export default function TicketPage() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const searchParams = useSearchParams();
  const movie = searchParams.get("movie") || "Назва фільму";
  const movieId = searchParams.get("id");
  let token: string | null = null;

  if (window != undefined)
    token = window.localStorage.getItem('token')
  else token = null

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/Sessions/movie/${movieId}`);
        const data = await response.json();
        setSessions(data.$values);
      } catch (error) {
        console.error("Помилка завантаження фільму:", error);
      }
    }
    fetchMovieDetails();
  }, [movieId, movie]);

  const toggleSeat = (row: number, seat: number) => {
    const isSelected = selectedSeats.some((s) => s.row === row && s.seat === seat);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === row && s.seat === seat)));
    } else {
      setSelectedSeats([...selectedSeats, { row, seat }]);
    }
  };

  const buyTicket = async () => {
    if (!selectedSession || selectedSeats.length === 0) {
      alert("Будь ласка, оберіть сеанс та місця перед покупкою!");
      return;
    }

    try {
      console.log(selectedSession);
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/Tickets/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            id: 0,
            placeId: 1,
            sessionId: selectedSession,
            userId: 5, // You might need to replace this with the actual user ID
            rowNumber: 1,
            seatNumber: 1,
            createdAt: new Date().toISOString(),
          }

        ),
      });

      if (!response.ok) throw new Error("Помилка при покупці квитка!");

      alert("Квиток успішно придбано!");
      setSelectedSeats([]); // Reset selection after purchase
    } catch (error) {
      console.error("Помилка при покупці:", error);
      alert("Сталася помилка, спробуйте ще раз.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Купівля квитків</h1>

      <div className={styles.movieInfo}>
        <h2 className={styles.movieTitle}>{movie}</h2>
      </div>

      <div>
        <DatePicker
          placeholderText="Оберіть дату"
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          locale="uk"
          className={styles.datepicker}
        />
      </div>

      <div className={styles.sessions}>
        <p>Оберіть сеанс:</p>
        <div className={styles.sessionList}>
          {sessions.map((session) => (
            <button
              key={session.id}
              className={`${styles.session} ${selectedSession === session.id ? styles.selected : ""}`}
              onClick={() => setSelectedSession(session.id)}
            >
              {new Date(session.dateTimeStart).toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              - {session.price} $
            </button>
          ))}
        </div>
      </div>

      <div className={styles.seats}>
        <p>Оберіть місця:</p>
        <div className={styles.seatMap}>
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <span className={styles.rowNumber}>Ряд {rowIndex + 1}</span>
              {row.map(({ row, seat }) => (
                <button
                  key={`${row}-${seat}`}
                  className={`${styles.seat} ${selectedSeats.some((s) => s.row === row && s.seat === seat) ? styles.selected : ""
                    }`}
                  onClick={() => toggleSeat(row, seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.confirmation}>
        <p>
          Дата: <strong>{selectedDate ? selectedDate.toLocaleDateString() : "Не обрано"}</strong>
        </p>
        <p>
          Сеанс:{" "}
          <strong>
            {selectedSession
              ? new Date(sessions.find((s) => s.id === selectedSession)?.dateTimeStart || "").toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              : "Не обрано"}
          </strong>
        </p>
        <p>Місця: {selectedSeats.map((s) => `Ряд ${s.row}, Місце ${s.seat}`).join(", ") || "Не обрано"}</p>
        <button className={styles.buyButton} onClick={buyTicket}>
          Підтвердити покупку
        </button>
      </div>
    </div>
  );
}
