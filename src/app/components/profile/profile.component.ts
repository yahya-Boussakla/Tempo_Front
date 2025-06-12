import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { AuthService, User } from "../../services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup
  user: User | null = null
  loading = false
  updateSuccess = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      name: ["", [Validators.required]],
      email: [{ value: "", disabled: true }],
    })
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.loading = true
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        })
        this.loading = false
      },
      error: (error) => {
        this.errorMessage = "Failed to load profile."
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return
    }

    this.loading = true
    this.updateSuccess = false
    this.errorMessage = ""

    const { name } = this.profileForm.getRawValue()

    this.authService.updateProfile({ name }).subscribe({
      next: (user) => {
        this.user = user
        this.updateSuccess = true
        this.loading = false
      },
      error: (error) => {
        this.errorMessage = error.error.message || "Failed to update profile."
        this.loading = false
      },
    })
  }

  logout(): void {
    this.authService.logout()
  }
}
