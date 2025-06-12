import { Component } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup
  errorMessage = ""
  loading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.errorMessage = ""

    const { email, password } = this.loginForm.value

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(["/profile"])
      },
      error: (error) => {
        this.loading = false
        this.errorMessage = error.error.message || "Login failed. Please check your credentials."
      },
    })
  }
}
