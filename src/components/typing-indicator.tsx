import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div className="flex gap-1 items-center my-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
    </motion.div>
  );
}