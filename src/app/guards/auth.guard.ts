import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuard = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated()) {
    return true
  }

  // Redirect to the login page
  return router.parseUrl("/login")
}

export const guestGuard = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.isAuthenticated()) {
    return true
  }

  // Redirect to the profile page if already logged in
  return router.parseUrl("/profile")
}
