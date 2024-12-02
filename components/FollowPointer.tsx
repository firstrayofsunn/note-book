
import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";


function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const color = stringToColor(info.email || "default");

  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        opacity: 0, // Start invisible
        scale: 0.5, // Start smaller
      }}
      animate={{
        opacity: 1, // Fade in
        scale: 1, // Grow to normal size
      }}
      exit={{
        opacity: 0, // Fade out
        scale: 0, // Shrink down
      }}
    >
      <svg
        stroke={color}
        fill={color}
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px]"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .557.103l-11.728 5.657a.5.5 0 0 1-.007.917L5.57 10.694l8.132-8.512a.5.5 0 0 1 .38-.386z" />
      </svg>
      <motion.div
       style={{
        backgroundColor: color, 
       }}
       initial={{
         scale: 0.5,
          opacity: 0,
       }}
        animate={{
           scale: 1, 
           opacity:1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className={"bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full"
        }
        >
        {info?.name || info.email}
    </motion.div>
    </motion.div>
  );
}

export default FollowPointer;
