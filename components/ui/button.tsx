import * as React from "react"

export function Button({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={
        "px-8 py-4 text-lg rounded-2xl shadow-lg bg-gradient-to-r from-pink-600 to-purple-700 text-white " +
        className
      }
      {...props}
    />
  )
}
