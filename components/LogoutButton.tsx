'use client'

import { logout } from '@/app/auth/actions'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button 
        type="submit"
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Se déconnecter
      </button>
    </form>
  )
} 