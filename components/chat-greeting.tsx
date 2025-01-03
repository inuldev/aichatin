import { motion } from "framer-motion";
import moment from "moment";

export const ChatGreeting = () => {
  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get("hour");
    if (hours >= 0 && hours < 12) {
      return `Selamat pagi, ${name}!`;
    } else if (hours >= 12 && hours < 18) {
      return `Selamat siang, ${name}!`;
    } else {
      return `Selamat malam, ${name}!`;
    }
  };

  return (
    <div className="flex flex-row items-center w-[680px] justify-start gap-2">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        className="text-2xl font-semibold tracking-tight text-zinc-100"
      >
        <span className="text-zinc-500">{renderGreeting("Guest")} 👋</span>
        <br />
        How can I help you with? ✨
      </motion.h1>
    </div>
  );
};
