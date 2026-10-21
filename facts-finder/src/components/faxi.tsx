import { cn } from "cn"

export type FaxiPose =
  | "welcome"
  | "thinking"
  | "encouraging"
  | "cheerful"
  | "celebrating"
  | "happy"
  | "excited"
  | "surprised"
  | "explaining"
  | "guiding"
  | "playing"
  | "achievement"

const sources: Record<FaxiPose, string> = {
  welcome: "/faxi/faxi-welcome.png",
  thinking: "/faxi/faxi-thinking.png",
  encouraging: "/faxi/faxi-encouraging.png",
  cheerful: "/faxi/faxi-cheerful.png",
  celebrating: "/faxi/faxi-celebrating.png",
  happy: "/faxi/faxi-happy.png",
  excited: "/faxi/faxi-excited.png",
  surprised: "/faxi/faxi-surprised.png",
  explaining: "/faxi/faxi-explaining.png",
  guiding: "/faxi/faxi-guiding.png",
  playing: "/faxi/faxi-playing.png",
  achievement: "/faxi/faxi-achievement.png",
}

export function Faxi({
  pose,
  className,
  alt = "",
}: {
  pose: FaxiPose
  className?: string
  alt?: string
}) {
  return (
    <img
      src={sources[pose]}
      alt={alt}
      className={cn("object-contain select-none", className)}
    />
  )
}
