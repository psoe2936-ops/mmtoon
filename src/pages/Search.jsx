import { useMemo, useState } from "react";
import BookCard from "../Component/BookCard";
import { useBooks } from "../data/bookStore";
import { useLanguage } from "../context/LanguageContext";

const Search = () => {
  const books = useBooks();
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");

  const allGenres = useMemo(
    () => ["All", ...new Set(books.flatMap((book) => book.genres))],
    [books]
  );

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const matchKeyword = book.title.toLowerCase().includes(keyword.toLowerCase());
        const matchStatus = statusFilter === "All" || book.status === statusFilter;
        const matchGenre = genreFilter === "All" || book.genres.includes(genreFilter);
        return matchKeyword && matchStatus && matchGenre;
      }),
    [books, keyword, statusFilter, genreFilter]
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 pb-24 md:pb-10">
      <div className="sticky top-[65px] z-20 mb-6 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t("search.placeholder")}
          className="mb-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white outline-none"
        />

        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => setStatusFilter("All")}
            className={`rounded-full border px-3 py-1 ${
              statusFilter === "All" ? "border-cyan-300 text-cyan-300" : "border-white/10 text-slate-300"
            }`}
          >
            {t("search.statusAll")}
          </button>
          <button
            onClick={() => setStatusFilter("Ongoing")}
            className={`rounded-full border px-3 py-1 ${
              statusFilter === "Ongoing"
                ? "border-cyan-300 text-cyan-300"
                : "border-white/10 text-slate-300"
            }`}
          >
            {t("search.statusOngoing")}
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`rounded-full border px-3 py-1 ${
              statusFilter === "Completed"
                ? "border-cyan-300 text-cyan-300"
                : "border-white/10 text-slate-300"
            }`}
          >
            {t("search.statusCompleted")}
          </button>

          <select
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
            className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-slate-200 outline-none"
          >
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>
                {t("search.genre")}: {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
};

export default Search;
