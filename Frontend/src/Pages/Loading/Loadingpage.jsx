import React, { useState, useEffect, useContext } from "react";
import { Theme } from "../../Context/ThemeContext/ThemeContext";

const quotes = [
  "A room without books is like a body without a soul. — Cicero",
  "So many books, so little time. — Frank Zappa",
  "The only thing that you absolutely have to know is the location of the library. — Albert Einstein",
  "Good friends, good books, and a sleepy conscience: this is the ideal life. — Mark Twain",
  "Books are a uniquely portable magic. — Stephen King",
  "I have always imagined that Paradise will be a kind of library. — Jorge Luis Borges",
];

const LoadingPage = () => {
  const { SwitchTheme } = useContext(Theme);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen p-4 ${
        SwitchTheme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      {/* Spinner */}
      <div className="border-8 border-gray-300 border-t-8 border-t-blue-600 rounded-full w-20 h-20 animate-spin mb-8"></div>

      {/* Loading text */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Loading...</h2>

      {/* Random quote */}
      <p className="text-center text-sm md:text-base italic max-w-xl">
        "{quote}"
      </p>
    </div>
  );
};

export default LoadingPage;
