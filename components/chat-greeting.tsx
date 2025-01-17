import { motion } from "framer-motion";
import moment from "moment";

export const ChatGreeting = () => {
  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get("hour");
    if (hours >= 0 && hours < 12) {
      return `Selamat pagi,!`;
    } else if (hours >= 12 && hours < 18) {
      return `Selamat siang,`;
    } else {
      return `Selamat malam,`;
    }
  };

  return (
    <div className="flex flex-row items-center w-[680px] justify-start gap-2">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        className="text-2xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-100"
      >
        <span className="dark:text-zinc-500 text-zinc-400">
          {renderGreeting("Guest")} 👋
        </span>
        <br />
        How can I help you with? ✨
      </motion.h1>
    </div>
  );
};
