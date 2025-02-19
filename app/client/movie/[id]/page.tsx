"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/styles/MovieDetails.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface Video {
  key: string;
  type: string;
  site: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return; // Переконуємось, що params.id існує

    const fetchMovieData = async () => {
      try {
        const [movieRes, trailerRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${TMDB_API_KEY}&language=uk-UA`),
          fetch(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${TMDB_API_KEY}&language=uk-UA`),
        ]);

        const movieData = await movieRes.json();
        const trailerData = await trailerRes.json();

        setMovie(movieData);

        // Знаходимо перший YouTube-трейлер
        const trailer = trailerData.results.find((video: Video) => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        console.error("Помилка завантаження даних фільму:", error);
      }
    };

    fetchMovieData();
  }, [params?.id]);

  if (!movie) return <p className={styles.loading}>Завантаження...</p>;

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      ></div>

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.movieInfo}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={styles.poster}
          />
          <div className={styles.details}>
            <h1>{movie.title}</h1>
            <p><strong>Дата виходу:</strong> {movie.release_date}</p>
            <p><strong>Рейтинг:</strong> {movie.vote_average}/10</p>
            <p><strong>Жанр:</strong> {movie.genres.map((g) => g.name).join(", ")}</p>
            <p><strong>Тривалість:</strong> {movie.runtime} хв</p>
            <p>{movie.overview}</p>

            <div className={styles.buttons}>
              <button
                className={styles.buyButton}
                onClick={() => router.push(`/client/tickets?movie=${encodeURIComponent(movie.title)}&id=${movie.id}`)}
              >
                Купити квиток
              </button>

              {trailerKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trailerButton}
                >
                  🎬 Дивитися трейлер
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
