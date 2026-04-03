Feature: Authorization role resolution and access guards
  As a platform operator
  I want role resolution and role guards to behave consistently
  So that unauthorized access is denied and safe fallbacks are applied

  Scenario: Missing identity data falls back to least privilege
    Given admin allowlist contains "admin@pluginbim.com"
    When I resolve role for email ""
    Then the resolved role should be "organizer"

  Scenario: Allowlisted admin can access admin panel
    Given admin allowlist contains "admin@pluginbim.com"
    When I resolve role for email "admin@pluginbim.com"
    Then admin panel access should be allowed

  Scenario: Organizer cannot access admin panel
    Given admin allowlist contains "admin@pluginbim.com"
    When I resolve role for email "organizer@example.com"
    Then admin panel access should be denied

  Scenario: Organizer can access organizer dashboard
    Given admin allowlist contains "admin@pluginbim.com"
    When I resolve role for email "organizer@example.com"
    Then organizer dashboard access should be allowed
