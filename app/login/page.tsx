import { login, signup } from './actions'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div>
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
    <div className="w-md mx-auto mt-8">
          <LoginForm />
    </div>
    </div>
  )
}