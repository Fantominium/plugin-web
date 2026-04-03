Feature: Login provider failure recovery
  As a user signing in
  I want clear provider failure guidance and a visible fallback
  So that I can continue authentication with magic link when Google fails

  Scenario: OAuth provider failure shows recovery guidance and fallback action
    Given the login page is opened with provider error "OAuthSignin"
    Then I should see inline recovery guidance
    And I should see the magic-link email field
    And I should see the send sign-in link action

  Scenario: Access denied still keeps magic-link path available
    Given the login page is opened with provider error "AccessDenied"
    Then the Google sign-in button should reference the error announcement
    And the magic-link submit button should reference the error announcement
    And I should see the magic-link email field
