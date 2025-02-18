"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 🔥 1. Додаємо інтерфейс для фільму
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=uk-UA&page=1`;

export default function Afisha() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 🔥 2. Перевіряємо, чи є у відповіді `results`
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Некоректна відповідь API");
        }

        setMovies(data.results);
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Афіша</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg object-cover"
            />
            <h2 className="text-xl font-semibold mt-4 text-white">{movie.title}</h2>
            <p className="text-gray-400">Рейтинг: {movie.vote_average}/10</p>
            <p className="text-gray-400">Дата виходу: {movie.release_date}</p>
            <Link href={`/client/tickets?movie=${encodeURIComponent(movie.title)}`}>
              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">
                Купити квиток
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
