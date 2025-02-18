import React from 'react';
import MovieCarousel from "@/components/MovieCarousel";
import Link from "next/link";
import {updateSession} from "@/lib/sessions";

export default function Home() {
    return (
      <div className="w-full h-screen">
        <MovieCarousel />
      </div>
    );
  }