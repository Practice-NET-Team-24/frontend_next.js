"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { registerLocale } from "react-datepicker";
import styles from "@/styles/TicketPage.module.css";
import { uk } from "date-fns/locale";

registerLocale("uk", uk);

interface Session {
  id: number;
  time: string;
  price: number;
}

interface Seat {
  row: number;
  seat: number;
  selected?: boolean;
}

const sessions: Session[] = [
  { id: 1, time: "12:00", price: 200 },
  { id: 2, time: "15:30", price: 250 },
  { id: 3, time: "18:00", price: 300 },
];

const seats: Seat[][] = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => ({
    row: row + 1,
    seat: col + 1,
    selected: false,
  }))
);

export default function TicketPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [movieTitle, setMovieTitle] = useState<string | null>("");

  const searchParams = useSearchParams();
  const movie = searchParams.get("movie") || "Назва фільму";
  const movieId = searchParams.get("id");

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!movieId) {
        setMovieTitle(movie);
        return;
      }

      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=uk-UA`);
        const data = await response.json();

        if (data && data.title) {
          setMovieTitle(data.title);
        } else {
          setMovieTitle(movie);
        }

        if (data.poster_path) {
          setMoviePoster(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
        } else {
          setMoviePoster(null);
        }
      } catch (error) {
        console.error("Помилка завантаження фільму:", error);
        setMovieTitle(movie);
        setMoviePoster(null);
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Купівля квитків</h1>

      {/* 🔥 Додано постер та назву фільму */}
      <div className={styles.movieInfo}>
        {moviePoster ? (
          <Image
            src={moviePoster}
            alt={movieTitle || "Постер фільму"}
            width={200}
            height={300}
            className={styles.moviePoster}
          />
        ) : (
          <div className={styles.noPoster}>❌ Постер відсутній</div>
        )}
        <h2 className={styles.movieTitle}>{movieTitle}</h2>
      </div>


      {/* Вибір дати */}
      <div>
        <DatePicker
          placeholderText="Оберіть дату"
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          locale="uk"
          className={styles.datepicker}
        />
      </div>

      {/* Вибір сеансу */}
      <div className={styles.sessions}>
        <p>Оберіть сеанс:</p>
        <div className={styles.sessionList}>
          {sessions.map((session) => (
            <button
              key={session.id}
              className={`${styles.session} ${selectedSession === session.id ? styles.selected : ""}`}
              onClick={() => setSelectedSession(session.id)}
            >
              {session.time} - {session.price} грн
            </button>
          ))}
        </div>
      </div>

      {/* Вибір місць */}
      <div className={styles.seats}>
        <p>Оберіть місця:</p>
        <div className={styles.seatMap}>
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <span className={styles.rowNumber}>Ряд {rowIndex + 1}</span> {/* ✅ Додано номер ряду */}
              {row.map(({ row, seat }) => (
                <button
                  key={`${row}-${seat}`}
                  className={`${styles.seat} ${selectedSeats.some((s) => s.row === row && s.seat === seat) ? styles.selected : ""}`}
                  onClick={() => toggleSeat(row, seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* Підтвердження */}
      <div className={styles.confirmation}>
        <p>
          Дата: <strong>{selectedDate ? selectedDate.toLocaleDateString() : "Не обрано"}</strong>
        </p>
        <p>
          Сеанс: <strong>{sessions.find((s) => s.id === selectedSession)?.time || "Не обрано"}</strong>
        </p>
        <p>Місця: {selectedSeats.map((s) => `Ряд ${s.row}, Місце ${s.seat}`).join(", ") || "Не обрано"}</p>
        <button className={styles.buyButton}>Підтвердити покупку</button>
      </div>
    </div>
  );
}
