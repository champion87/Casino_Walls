import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// For example:
// await call_api(`/api/games/${game_key}/blackjack/get_score`, "get")
export async function call_api(path, the_method) {
  const ip = "192.168.13.15"


  if (the_method == undefined) { throw "you forgot the method parameter" }
  try {
    // return await fetch(`http://127.0.0.1:8000${path}`, {
    return await fetch(`http://${ip}:81${path}`, {
      method: the_method,
      mode: 'cors',
      credentials: 'include'
    });
  } catch (error) {
    console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxx:', error);
    throw "oof"
  }
}

