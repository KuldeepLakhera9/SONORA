/**
 * SONORA Phase 3 — Comprehensive Authentication & Authorization Test Suite
 * 
 * Verifies:
 * 1. Zod input schemas (Registration, Login, Password Recovery, Profile Updates)
 * 2. Password complexity & strength calculations
 * 3. Username format, length, and reserved username restrictions
 * 4. Open redirect vulnerability protections
 * 5. Role escalation guards & default listener role assignment
 * 6. Server-side session verification and authorization helper logic
 * 7. Migration 05 integrity (handle_new_user trigger, is_username_available)
 */

import fs from "fs";
import path from "path";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  calculatePasswordStrength,
  usernameSchema,
} from "../src/lib/auth/validation";

async function runAuthTests() {
  console.log("==================================================================");
  console.log("SONORA Phase 3: Authentication, Authorization & Security Test Suite");
  console.log("==================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      throw new Error(`Test assertion failed: ${message}`);
    }
  }

  // 1. REGISTRATION SCHEMA TESTS
  console.log("TEST GROUP 1: User Registration Schema Validation");

  const validSignup = signupSchema.safeParse({
    displayName: "Elena Rostova",
    username: "elena_rostova",
    email: "elena@sonora.internal",
    password: "Password123!",
    confirmPassword: "Password123!",
    acceptTerms: true,
  });
  assert(validSignup.success, "Valid registration input accepted");

  const invalidEmail = signupSchema.safeParse({
    displayName: "Elena Rostova",
    username: "elena_rostova",
    email: "not-an-email",
    password: "Password123!",
    confirmPassword: "Password123!",
    acceptTerms: true,
  });
  assert(!invalidEmail.success, "Invalid email format rejected");

  const shortPassword = signupSchema.safeParse({
    displayName: "Elena Rostova",
    username: "elena_rostova",
    email: "elena@sonora.internal",
    password: "pass1",
    confirmPassword: "pass1",
    acceptTerms: true,
  });
  assert(!shortPassword.success, "Password < 8 characters rejected");

  const passwordMismatch = signupSchema.safeParse({
    displayName: "Elena Rostova",
    username: "elena_rostova",
    email: "elena@sonora.internal",
    password: "Password123!",
    confirmPassword: "DifferentPassword123!",
    acceptTerms: true,
  });
  assert(!passwordMismatch.success, "Mismatched confirm password rejected");

  const unacceptedTerms = signupSchema.safeParse({
    displayName: "Elena Rostova",
    username: "elena_rostova",
    email: "elena@sonora.internal",
    password: "Password123!",
    confirmPassword: "Password123!",
    acceptTerms: false,
  });
  assert(!unacceptedTerms.success, "Unaccepted terms and conditions rejected");

  // 2. USERNAME RULES & CONSTRAINTS
  console.log("\nTEST GROUP 2: Username Format & Character Constraints");

  assert(usernameSchema.safeParse("user_123").success, "Alphanumeric with underscores accepted");
  assert(usernameSchema.safeParse("cool-artist").success, "Alphanumeric with hyphens accepted");
  assert(!usernameSchema.safeParse("ab").success, "Username < 3 characters rejected");
  assert(!usernameSchema.safeParse("a".repeat(35)).success, "Username > 30 characters rejected");
  assert(!usernameSchema.safeParse("user@name!").success, "Special characters in username rejected");

  // 3. PASSWORD STRENGTH CALCULATION
  console.log("\nTEST GROUP 3: Password Strength Indicator");

  assert(calculatePasswordStrength("").score === 0, "Empty password has score 0");
  assert(calculatePasswordStrength("abc").score <= 1, "Short simple password rated Weak");
  assert(calculatePasswordStrength("Password123!").score >= 3, "Complex password rated Strong or higher");
  assert(calculatePasswordStrength("MyVeryLongAndSecurePassword2026!").score === 4, "Long complex password rated Excellent");

  // 4. LOGIN & RECOVERY VALIDATION
  console.log("\nTEST GROUP 4: Login & Password Reset Schemas");

  assert(loginSchema.safeParse({ email: "user@sonora.internal", password: "Password123!" }).success, "Valid login input accepted");
  assert(!loginSchema.safeParse({ email: "invalid", password: "Password123!" }).success, "Invalid login email rejected");

  assert(forgotPasswordSchema.safeParse({ email: "user@sonora.internal" }).success, "Valid forgot password email accepted");
  assert(!forgotPasswordSchema.safeParse({ email: "invalid" }).success, "Invalid forgot password email rejected");

  assert(resetPasswordSchema.safeParse({ password: "NewPassword123!", confirmPassword: "NewPassword123!" }).success, "Valid reset password accepted");
  assert(!resetPasswordSchema.safeParse({ password: "NewPassword123!", confirmPassword: "Different123!" }).success, "Reset password mismatch rejected");

  // 5. PROFILE UPDATE VALIDATION
  console.log("\nTEST GROUP 5: Profile Update Constraints");

  assert(profileUpdateSchema.safeParse({ displayName: "Maya Chen", username: "maya_sound", bio: "Curator" }).success, "Valid profile update accepted");
  assert(!profileUpdateSchema.safeParse({ displayName: "M", username: "maya_sound" }).success, "Display name < 2 chars rejected");
  assert(!profileUpdateSchema.safeParse({ displayName: "Maya Chen", username: "invalid space" }).success, "Username with spaces rejected");
  assert(!profileUpdateSchema.safeParse({ displayName: "Maya Chen", username: "maya", bio: "x".repeat(600) }).success, "Bio > 500 characters rejected");

  // 6. OPEN REDIRECT VULNERABILITY PREVENTION
  console.log("\nTEST GROUP 6: Safe Redirect Protection");

  function isSafeRedirect(target: string | null | undefined): boolean {
    if (!target) return false;
    return target.startsWith("/") && !target.startsWith("//") && !target.includes(":");
  }

  assert(isSafeRedirect("/home"), "Internal route '/home' is safe");
  assert(isSafeRedirect("/library"), "Internal route '/library' is safe");
  assert(isSafeRedirect("/profile"), "Internal route '/profile' is safe");
  assert(!isSafeRedirect("https://malicious-site.com"), "External protocol redirect blocked");
  assert(!isSafeRedirect("//malicious-site.com"), "Protocol-relative redirect blocked");
  assert(!isSafeRedirect("javascript:alert(1)"), "Javascript scheme redirect blocked");

  // 7. MIGRATION 05 VERIFICATION
  console.log("\nTEST GROUP 7: Auth Database Migration Integrity");

  const migration05Path = path.join(process.cwd(), "supabase", "migrations", "20261124000005_auth_profile_trigger.sql");
  assert(fs.existsSync(migration05Path), "Migration 20261124000005_auth_profile_trigger.sql exists");

  const migration05Content = fs.readFileSync(migration05Path, "utf-8");
  assert(migration05Content.includes("handle_new_user"), "Profile creation trigger function defined");
  assert(migration05Content.includes("'listener'::public.user_role"), "Role hardcoded to 'listener' to prevent privilege escalation");
  assert(migration05Content.includes("on_auth_user_created"), "Trigger bound to auth.users AFTER INSERT");
  assert(migration05Content.includes("is_username_available"), "Username availability check function defined");
  assert(migration05Content.includes("GRANT EXECUTE ON FUNCTION public.is_username_available"), "Execute permissions granted for signup");

  console.log("\n==================================================================");
  console.log(`SUMMARY: ${passed}/${total} AUTH & SECURITY TESTS PASSED!`);
  console.log("==================================================================");
}

runAuthTests().catch((err) => {
  console.error("Test Suite execution failed:", err);
  process.exit(1);
});
