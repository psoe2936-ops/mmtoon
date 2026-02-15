import { firstComicChapters } from "./firstComicData";

export const books = [
  {
    id: "first-comic",
    title: "First Comic",
    description:
      "Your real uploaded comic with full chapter images from local archive.",
    status: "Ongoing",
    genres: ["Action", "Fantasy"],
    views: 1,
    rating: 5,
    updatedAt: "2026-01-06",
    cover: firstComicChapters[0]?.pages?.[0] || "/image.jpg-removebg-preview.png",
    chapters: firstComicChapters,
  },
];

export const getBookById = (id) => books.find((book) => book.id === id);
