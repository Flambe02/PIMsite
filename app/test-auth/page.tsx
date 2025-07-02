import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TestAuthPage() {
  // TEMPORARILY DISABLED - Supabase client causing fatal errors
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Authentication Test Page</h1>
      <p style={{ color: 'orange', fontWeight: 'bold' }}>
        TEMPORARILY DISABLED - Supabase client causing fatal errors
      </p>
      <p>This page is temporarily disabled due to Supabase client issues.</p>
      <p>The error was: <code>Cannot read properties of undefined (reading 'getUser')</code></p>
      
      {/* Original code commented out:
      {user ? (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            SUCCESS: User is logged in.
          </p>
          <p>User Email: {user.email}</p>
        </div>
      ) : (
        <div>
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            FAILURE: No user session found on the server.
          </p>
          <p>
            Please{' '}
            <Link href="/login" style={{ textDecoration: 'underline' }}>
              log in
            </Link>{' '}
            and come back to this page.
          </p>
        </div>
      )}
      */}
      
      <Link href="/dashboard" style={{ display: 'block', marginTop: '20px', textDecoration: 'underline' }}>
          Back to Dashboard
      </Link>
    </div>
  )
} 