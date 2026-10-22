import { supabase } from "@/lib/supabase"

export async function saveFeedback(input: {
  userId: string | null
  rating: number
  body: string
  file: File | null
}) {
  if (!supabase) return false
  let audioPath: string | null = null
  if (input.file) {
    const ext = input.file.type.includes("mp4") ? "m4a" : "webm"
    audioPath = `${input.userId ?? "anon"}/${crypto.randomUUID()}.${ext}`
    const uploaded = await supabase.storage.from("feedback-audio").upload(audioPath, input.file, {
      contentType: input.file.type || "audio/webm",
      upsert: false,
    })
    if (uploaded.error) return false
  }
  const inserted = await supabase.from("feedback").insert({
    user_id: input.userId,
    rating: input.rating,
    body: input.body || null,
    audio_path: audioPath,
  })
  return !inserted.error
}
