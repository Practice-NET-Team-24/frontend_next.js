"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


export type Movies = Movie[]

export interface Movie {
  id: number
  name: string
  description: string
  imageURL: string
  trailerURL: string
  ageRestriction: number
  duration: number
  rating: number
  movieActors: MovieActor[]
  movieGenres: MovieGenre[]
}

export interface MovieActor {
  id: number
  movieId: number
  actorId: number
  role: string
  actor: Actor
}

export interface Actor {
  id: number
  name: string
  surname: string
}

export interface MovieGenre {
  id: number
  movieId: number
  genreId: number
  genre: Genre
}

export interface Genre {
  id: number
  name: string
}


const API_URL = `http://localhost:5227/api/Movies`;

export default function Afisha() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        setMovies(data);
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Афіша</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Image
              src={`${movie.imageURL}`}
              alt={movie.name}
              width={500}
              height={750}
              className="rounded-lg object-cover"
            />
            <h2 className="text-xl font-semibold mt-4 text-white">{movie.name}</h2>
            <p className="text-gray-400">Рейтинг: {movie.rating}/10</p>
            <Link href={`/client/tickets?movie=${encodeURIComponent(movie.name)}`}>

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
