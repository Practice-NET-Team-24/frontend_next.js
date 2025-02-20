"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface Movies {
  $id: string
  $values: Movie[]
}

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
  movieActors: MovieActors
  movieGenres: MovieGenres
}

export interface MovieActors {
  $id: string
  $values: Value2[]
}

export interface Value2 {
  $id: string
  id: number
  movieId: number
  actorId: number
  role: string
  actor: Actor
}

export interface Actor {
  $id: string
  id: number
  name: string
  surname: string
}

export interface MovieGenres {
  $id: string
  $values: Value3[]
}

export interface Value3 {
  $id: string
  id: number
  movieId: number
  genreId: number
  genre: Genre
}

export interface Genre {
  $id: string
  id: number
  name: string
}



export default function Afisha() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;  
  const [movies, setMovies] = useState<Movies>();
  const router = useRouter();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/Movies`);
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
        {movies && movies.$values.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => router.push(`/client/movie/${movie.id}`)}>
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
  )
}
