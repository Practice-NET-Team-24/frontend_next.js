"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
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

      {/* Вибір дати */}
      <div>
      <DatePicker
              placeholderText="Оберіть дату"  // Текст підказки
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              locale="uk"  // Встановлюємо українську мову
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
