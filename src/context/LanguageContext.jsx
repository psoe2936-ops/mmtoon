import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);
const STORAGE_KEY = "mmtoon_lang";

const translations = {
  en: {
    "nav.home": "Home",
    "nav.books": "Books",
    "nav.search": "Search",
    "nav.admin": "Admin",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.language": "MY",
    "hero.welcome": "Welcome to MMToon",
    "hero.title1": "Discover Amazing",
    "hero.title2": "Manga & Comics",
    "hero.desc":
      "Read trending stories with smooth dark mode experience. Fast reader. Clean interface. Built for passionate readers.",
    "hero.start": "Start Reading",
    "hero.explore": "Explore",
    "home.weekly": "Weekly Spotlight",
    "home.best": "Best Reading",
    "home.trending": "Trending Now",
    "bookList.title": "All Books",
    "bookList.newest": "Newest",
    "bookList.viewed": "Most Viewed",
    "bookList.rated": "Top Rated",
    "book.statusOngoing": "Ongoing",
    "book.statusCompleted": "Completed",
    "book.views": "views",
    "detail.notFound": "Book not found.",
    "detail.status": "Status",
    "detail.views": "Views",
    "detail.chapters": "Chapters",
    "detail.read": "Read",
    "detail.noChapters": "No Chapters Yet",
    "detail.favorite": "Favorite",
    "detail.download": "Download",
    "detail.downloadLogin": "Download (Login Required)",
    "detail.updated": "Updated",
    "detail.noChapterUploaded": "No chapters uploaded yet.",
    "detail.chapterLabel": "Chapter",
    "reader.notFound": "Chapter not found.",
    "reader.back": "Back",
    "reader.prev": "Prev",
    "reader.next": "Next",
    "reader.prevChapter": "Prev Chapter",
    "reader.nextChapter": "Next Chapter",
    "reader.pages": "Pages",
    "reader.chapter": "Chapter",
    "search.placeholder": "Search manga or comics...",
    "search.statusAll": "Status: All",
    "search.statusOngoing": "Ongoing",
    "search.statusCompleted": "Completed",
    "search.genre": "Genre",
    "login.title": "Login",
    "login.desc": "Sign in to unlock downloads and sync your reading activity.",
    "login.google": "Login with Google",
    "login.failed": "Login failed",
  },
  my: {
    "nav.home": "ပင်မစာမျက်နှာ",
    "nav.books": "စာအုပ်များ",
    "nav.search": "ရှာဖွေရန်",
    "nav.admin": "အက်မင်",
    "nav.login": "လော့ဂ်အင်",
    "nav.logout": "ထွက်ရန်",
    "nav.language": "EN",
    "hero.welcome": "MMToon မှ ကြိုဆိုပါတယ်",
    "hero.title1": "အကောင်းဆုံး",
    "hero.title2": "မန်ဂါနှင့် ကာတွန်းများ",
    "hero.desc":
      "လူကြိုက်များသော ဇာတ်လမ်းများကို Dark Mode ဖြင့် ချောမွေ့စွာ ဖတ်ရှုနိုင်သည်။ မြန်ဆန်သော Reader၊ သန့်ရှင်းသော UI။",
    "hero.start": "စဖတ်မယ်",
    "hero.explore": "ရှာဖွေမယ်",
    "home.weekly": "အပတ်စဉ် အထူးရွေးချယ်မှု",
    "home.best": "အကောင်းဆုံး ဖတ်ရှုမှု",
    "home.trending": "လက်ရှိ လူကြိုက်များ",
    "bookList.title": "စာအုပ်အားလုံး",
    "bookList.newest": "အသစ်ဆုံး",
    "bookList.viewed": "ကြည့်ရှုမှုအများဆုံး",
    "bookList.rated": "အဆင့်သတ်မှတ်မှုအမြင့်ဆုံး",
    "book.statusOngoing": "ဆက်လက်ထုတ်ဝေနေ",
    "book.statusCompleted": "ပြီးဆုံး",
    "book.views": "ကြည့်ရှုမှု",
    "detail.notFound": "စာအုပ်မတွေ့ပါ။",
    "detail.status": "အခြေအနေ",
    "detail.views": "ကြည့်ရှုမှု",
    "detail.chapters": "အပိုင်းများ",
    "detail.read": "ဖတ်ရန်",
    "detail.noChapters": "အပိုင်းမရှိသေးပါ",
    "detail.favorite": "အကြိုက်",
    "detail.download": "ဒေါင်းလုဒ်",
    "detail.downloadLogin": "ဒေါင်းလုဒ် (လော့ဂ်အင်လိုအပ်)",
    "detail.updated": "နောက်ဆုံးအပ်ဒိတ်",
    "detail.noChapterUploaded": "အပိုင်းများ မတင်ရသေးပါ။",
    "detail.chapterLabel": "အပိုင်း",
    "reader.notFound": "အပိုင်းမတွေ့ပါ။",
    "reader.back": "နောက်သို့",
    "reader.prev": "ယခင်",
    "reader.next": "နောက်",
    "reader.prevChapter": "ယခင်အပိုင်း",
    "reader.nextChapter": "နောက်အပိုင်း",
    "reader.pages": "စာမျက်နှာ",
    "reader.chapter": "အပိုင်း",
    "search.placeholder": "မန်ဂါ သို့မဟုတ် ကာတွန်း ရှာဖွေရန်...",
    "search.statusAll": "အခြေအနေ: အားလုံး",
    "search.statusOngoing": "ဆက်လက်ထုတ်ဝေနေ",
    "search.statusCompleted": "ပြီးဆုံး",
    "search.genre": "အမျိုးအစား",
    "login.title": "လော့ဂ်အင်",
    "login.desc": "ဒေါင်းလုဒ်ဖွင့်ရန်နှင့် ဖတ်ရှုမှုကို Sync လုပ်ရန် လော့ဂ်အင်ဝင်ပါ။",
    "login.google": "Google ဖြင့် လော့ဂ်အင်ဝင်မယ်",
    "login.failed": "လော့ဂ်အင် မအောင်မြင်ပါ",
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "my" ? "my" : "en";
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === "en" ? "my" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const t = (key) => translations[lang][key] || translations.en[key] || key;

  const value = useMemo(
    () => ({ lang, t, toggleLanguage }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
