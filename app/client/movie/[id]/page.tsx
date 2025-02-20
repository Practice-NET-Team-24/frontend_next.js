"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/styles/MovieDetails.module.css";

export interface Movie {
  $id: string
  id: number
  name: string
  description: string
  imageURL: string
  trailerURL: string
  ageRestriction: number
  duration: number
  rating: number
  sessions: any
  movieGenres: MovieGenres
  movieActors: MovieActors
}

export interface MovieGenres {
  $id: string
  $values: Value[]
}

export interface Value {
  $id: string
  id: number
  movieId: number
  genreId: number
  movie: Movie
  genre: Genre
}

export interface Movie {
  $ref: string
}

export interface Genre {
  $id: string
  id: number
  name: string
  movieGenres: MovieGenres2
}

export interface MovieGenres2 {
  $id: string
  $values: Value2[]
}

export interface Value2 {
  $ref: string
}

export interface MovieActors {
  $id: string
  $values: Value3[]
}

export interface Value3 {
  $id: string
  id: number
  movieId: number
  actorId: number
  role: string
  movie: Movie2
  actor: Actor
}

export interface Movie2 {
  $ref: string
}

export interface Actor {
  $id: string
  id: number
  name: string
  surname: string
  movieActors: MovieActors2
}

export interface MovieActors2 {
  $id: string
  $values: Value4[]
}

export interface Value4 {
  $ref: string
}

export default function MovieDetails() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [movie, setMovie] = useState<Movie | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return; // Переконуємось, що params.id існує

    const fetchMovieData = async () => {
      try {
        const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/Movies/${params.id}`);

        const movieData = await data.json();
        setMovie(movieData);

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
        // style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      ></div>

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.movieInfo}>
          <img
            src={`${movie.imageURL}`}
            alt={movie.name}
            className={styles.poster}
          />
          <div className={styles.details}>
            <h1>{movie.name}</h1>
            <p><strong>Рейтинг:</strong> {movie.rating}/10</p>
            <p><strong>Жанр:</strong> {movie.movieGenres.$values.map((g) => g.genre.name).join(", ")}</p>
            <p><strong>Тривалість:</strong> {movie.duration} хв</p>
            <p>{movie.description}</p>

            <div className={styles.buttons}>
              <button
                className={styles.buyButton}
                onClick={() => router.push(`/client/tickets?movie=${encodeURIComponent(movie.name)}&id=${movie.id}`)}
              >
                Купити квиток
              </button>

              {movie.trailerURL && (
                <a
                  href={`${movie.trailerURL}`}
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
