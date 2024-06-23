import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function call_api(path, the_method){
  if (the_method == undefined) {throw "you forgot the method parameter"}
  return await fetch(`http://127.0.0.1:8000/${path}`, {
    method: the_method,
    mode: 'cors',
    credentials: 'include'
  });
}

