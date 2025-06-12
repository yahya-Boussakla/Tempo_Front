import type { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { RegisterComponent } from "./components/register/register.component"
import { ProfileComponent } from "./components/profile/profile.component"
import { authGuard, guestGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [guestGuard] },
  { path: "register", component: RegisterComponent, canActivate: [guestGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "**", redirectTo: "/login" },
]
