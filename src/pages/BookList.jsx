import { useMemo, useState } from "react";
import BookCard from "../Component/BookCard";
import { useBooks } from "../data/bookStore";
import { useLanguage } from "../context/LanguageContext";

const sorters = {
  newest: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  viewed: (a, b) => b.views - a.views,
  rated: (a, b) => b.rating - a.rating,
};

const BookList = () => {
  const books = useBooks();
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState("newest");

  const sortedBooks = useMemo(
    () => [...books].sort(sorters[sortBy] || sorters.newest),
    [books, sortBy]
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 pb-24 md:pb-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{t("bookList.title")}</h1>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 outline-none"
        >
          <option value="newest">{t("bookList.newest")}</option>
          <option value="viewed">{t("bookList.viewed")}</option>
          <option value="rated">{t("bookList.rated")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
};

export default BookList;
