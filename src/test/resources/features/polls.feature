# language: en
# ------------------------------------------------------------------------------
Feature: Vote in SEIUM Doodle
  In order to ensure Doodle voting poll system works properly
  As a user
  I want to ensure that I can submit, edit and delete entries there

  Background: 
    Given I'm at doodle with ID "776qtpf6vqm9tfi5"

  Scenario: Simple vote in Doodle
    When I fill my name with "Minium"
    And I select the following options:
      | day    | time    |
      | Thu 19 | 2:30 PM |
      | Fri 20 | 5:30 PM |
    And I save it
    Then I should see the following message:
      """
      Thanks, Minium,
      your choices have been submitted.
      """

  Scenario: Simple vote in Doodle with random values
    When I go to doodle with ID "776qtpf6vqm9tfi5"
    And I fill an entry with random data
    And I save it
    Then I should see the following message:
      """
      your choices have been submitted.
      """

  Scenario: Lots of data
    When there are 2 entries with random data
    And I go to doodle with ID "776qtpf6vqm9tfi5"
    Then I should see 2 entries
