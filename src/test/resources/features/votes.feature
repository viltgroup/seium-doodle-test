# language: en
# ------------------------------------------------------------------------------
Feature: Vote in SEIUM Doodle

  Scenario: Simple vote in Doodle
    When I go to doodle with ID "776qtpf6vqm9tfi5"
    And I fill my name with "Minium"
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
      Thanks, Minium,
      your choices have been submitted.
      """

  Scenario: Delete votes
    Given no entries for "Minium" exist in doodle with ID "776qtpf6vqm9tfi5"
