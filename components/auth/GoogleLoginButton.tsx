import OAuthLoginButton from "./OAuthLoginButton"

interface GoogleLoginButtonProps {
  className?: string
  children?: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  return <OAuthLoginButton provider="google" {...props} />
} 