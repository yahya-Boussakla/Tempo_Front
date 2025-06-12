import { inject } from "@angular/core"
import type { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService)
  const router = inject(Router)

  const token = authService.getToken()

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.navigate(["/login"])
      }
      return throwError(() => error)
    }),
  )
}
