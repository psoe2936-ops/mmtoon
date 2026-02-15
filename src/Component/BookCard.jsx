import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const statusClass = {
  Ongoing: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  Completed: "bg-sky-500/20 text-sky-200 border-sky-400/30",
};

const BookCard = ({ book, compact = false }) => {
  const { t } = useLanguage();
  const statusLabel =
    book.status === "Ongoing"
      ? t("book.statusOngoing")
      : book.status === "Completed"
      ? t("book.statusCompleted")
      : book.status;

  return (
    <Link
      to={`/book/${book.id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:scale-[1.02] hover:bg-white/5"
    >
      <div className={compact ? "aspect-[3/4] overflow-hidden" : "aspect-[4/5] overflow-hidden"}>
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="space-y-2 p-3">
        <h3 className="truncate text-sm font-semibold text-white">{book.title}</h3>

        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            className={`rounded-full border px-2 py-1 ${
              statusClass[book.status] || "bg-white/10 text-slate-200 border-white/20"
            }`}
          >
            {statusLabel}
          </span>
          <span className="text-slate-400">
            {book.views.toLocaleString()} {t("book.views")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
