import { Component } from "@angular/core";
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = "";
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        password_confirmation: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("password_confirmation")?.value;

    if (password !== confirmPassword) {
      form.get("password_confirmation")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    const { name, email, password, password_confirmation } = this.registerForm.value;

    this.authService.register(name, email, password, password_confirmation).subscribe({
      next: () => {
        this.router.navigate(["/profile"]);
      },
      error: (error) => {
        this.loading = false;
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          const firstError = Object.values(errors)[0] as string[];
          this.errorMessage = firstError[0] || "Registration failed.";
        } else {
          this.errorMessage = error.error.message || "Registration failed.";
        }
      },
    });
  }
}