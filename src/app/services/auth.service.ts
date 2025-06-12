import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import { Router } from "@angular/router"

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8000/api"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUser()
  }

  private loadUser(): void {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user))
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        this.currentUserSubject.next(response.user)
      }),
    )
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        name,
        email,
        password,
        password_confirmation,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
          this.currentUserSubject.next(response.user)
        }),
      )
  }

  logout(): void {
    // Call the logout endpoint if your API requires it
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout(),
    })
  }

  private handleLogout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`)
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user`, userData).pipe(
      tap((updatedUser) => {
        const currentUser = this.currentUserSubject.value
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser }
          localStorage.setItem("user", JSON.stringify(newUser))
          this.currentUserSubject.next(newUser)
        }
      }),
    )
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }
}
