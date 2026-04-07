Feature: Public route destination validation
  As a platform visitor
  I want route destination checks to allow only implemented public paths
  So that navigation never points to dead-end pages

  Scenario: Accept known public shell routes
    Given implemented public routes are defined
    When I validate the destination "/contact-us"
    Then the destination should be valid

  Scenario: Accept event detail dynamic destinations
    Given implemented public routes are defined
    When I validate the destination "/events/community-night-2026"
    Then the destination should be valid

  Scenario: Reject unknown destinations
    Given implemented public routes are defined
    When I validate the destination "/categories"
    Then the destination should be invalid
