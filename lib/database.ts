import { films, actors, genres } from "./mockData";

export function getUserBookings() {
  return bookings.filter((b) => b.userId === 1);
}

const bookings = [
  { id: 1, userId: 1, film: { id: 1, name: "Avengers: Endgame" }, session: { time: "18:00" } },
  { id: 2, userId: 2, film: { id: 2, name: "Inception" }, session: { time: "20:00" } },
];

export function deleteBooking(bookingId: number) {
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return false;

  bookings.splice(index, 1);
  return true;
}


// 🟢 Отримати всі фільми
export function getFilms() {
  return films;
}

// 🟢 Отримати фільм за ID
export function getFilmById(id: number) {
  return films.find((film) => film.id === id);
}

// 🟢 Додати новий фільм
export function addFilm(newFilm: any) {
  newFilm.id = films.length + 1;
  newFilm.movieActors = newFilm.movieActors || [];
  newFilm.movieGenres = newFilm.movieGenres || [];
  films.push(newFilm);
  return newFilm;
}

// 🟢 Отримати всіх акторів
export function getActors() {
  return actors;
}

// 🟢 Додати актора
export function addActor(name: string, surname: string) {
  const newActor = { id: actors.length + 1, name, surname };
  actors.push(newActor);
  return newActor;
}

// 🟢 Отримати всі жанри
export function getGenres() {
  return genres;
}

// 🟢 Додати жанр
export function addGenre(name: string) {
  const newGenre = { id: genres.length + 1, name };
  genres.push(newGenre);
  return newGenre;
}
