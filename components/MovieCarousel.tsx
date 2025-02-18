"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "@/styles/MovieCarousel.module.css";
import Link from "next/link";

// 🔥 1. Додаємо інтерфейс для фільму
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

// 🔥 2. Створюємо API-URL
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=uk-UA&page=1`;

export default function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(TMDB_API_URL);
        const data = await res.json();

        // 🔥 3. Перевіряємо, чи є у відповіді `results`
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Некоректна відповідь API");
        }

        setMovies(data.results.slice(0, 5)); // Беремо лише 5 фільмів
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      autoplay={{ delay: 5000 }}
      loop={true}
      navigation
      pagination={{ clickable: true }}
      className={styles.swiper}
    >
      {movies.map((movie) => (
        <SwiperSlide
          key={movie.id}
          className={styles.slide}
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        >
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <h1 className={styles.title}>{movie.title}</h1>
            <Link href={`/client/tickets?movie=${encodeURIComponent(movie.title)}`}>
              <button className={styles.button}>Купити квиток</button>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
