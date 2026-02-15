import { useEffect, useState } from "react";
import { books as seedBooks } from "./mockData";

export const STORAGE_KEY = "mmtoon_admin_books_v1";

const clone = (value) => JSON.parse(JSON.stringify(value));

export const loadBooks = () => {
  if (typeof window === "undefined") return clone(seedBooks);

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return clone(seedBooks);

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : clone(seedBooks);
  } catch {
    return clone(seedBooks);
  }
};

export const emitBooksUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("mmtoon-books-updated"));
};

export const useBooks = () => {
  const [books, setBooks] = useState(() => loadBooks());

  useEffect(() => {
    const refresh = () => setBooks(loadBooks());
    window.addEventListener("storage", refresh);
    window.addEventListener("mmtoon-books-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("mmtoon-books-updated", refresh);
    };
  }, []);

  return books;
};
