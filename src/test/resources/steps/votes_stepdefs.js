var expect        = require("expect-webelements"),
    timeUnits     = require("minium/timeunits"),
    _             = require("lodash"),
    Chance        = require('chance'),
    cucumberutils = require("cucumber/utils");

var base = $(":root").unless(".loading:visible");
$(":root").configure()
  .waitingPreset("slow")
    .timeout(20, timeUnits.SECONDS)
  .done()
  .interactionListeners()
    .clear()
    .add(minium.interactionListeners.unhandledAlert().accept())
    .add(minium.interactionListeners.waitOnTimeout().unless(base).forExistence(base).withWaitingPreset("slow"));

// some helper functions
function openDoodle(doodleId) {
  browser.get("http://doodle.com/" + doodleId);
}

function deleteEntries(entries) {
  var entry = entries.first();
  base.waitForExistence();
  
  while (entry.checkForExistence("immediate")) {
    var deleteIcon    = base.find(".inlineDeleteIcon").leftOf(entry);
    var confirmDelete = base.find("#btn-yes");
    
    entry.moveTo();
    deleteIcon.click();
    confirmDelete.click();
    
    base.waitForExistence();
  }
}

function fillRandomData() {
  // Instantiate Chance so it can be used
  var chance = new Chance();

  var randomName = chance.name();
  var nameFld    = $("#pname");
  var checkboxes = $(":checkbox").rightOf(nameFld); 
  nameFld.fill(randomName);
  
  var numSelected = chance.integer({min: 0, max: checkboxes.size() });
  for (var i = 0; i < numSelected; i++) {
    var index = chance.integer({min: 0, max: checkboxes.size() - 1 });
    checkboxes.eq(index).check();
  }
}

function ensureAtPoll() {
  base.waitForExistence();
  var returnToPoll = $("#returnToPoll");
  if (returnToPoll.checkForExistence("immediate")) {
    returnToPoll.click();
  }
}

// Step definitions

When(/^I'm at doodle with ID "(.*?)"$/, function (doodleId) {
  openDoodle(doodleId);
});

When(/^I go to doodle with ID "(.*?)"$/, function (doodleId) {
  openDoodle(doodleId);
});

When(/^I fill my name with "(.*?)"$/, function (name) {
  $("#pname").fill(name);
});

When(/^I fill an entry with random data$/, function () {
  ensureAtPoll();
  fillRandomData();
});

Given(/^there are (\d+) entries with random data$/, function (numEntries) {
  deleteEntries(base.find("div.pname"));
  ensureAtPoll();
  for (var i = 0; i < numEntries; i++) {
    var saveBtn      = $("#save");
    var returnToPoll = $("#returnToPoll");
     
    fillRandomData();
    saveBtn.click();
    returnToPoll.click();
  }
});

When(/^I select the following options:$/, function (data) {
  var options = cucumberutils.asObjects(data);
  options.forEach(function (option) {
    // option = { day : "Fri 20", time : "2:30 PM" }
    var day      = $(".day div").withText(option.day);
    var time     = $(".time div").withText(option.time).below(day);
    var checkbox = $(":checkbox").below(time);
    
    checkbox.check();
  });
});

When(/^I save it$/, function () {
  $("#save").click();
});

Then(/^I should see the following message:$/, function (msg) {
  msg.split("\n").forEach(function (line, i) {
    expect($(".green").withText(line)).not.to.be.empty();
  });
});

Then(/^I should see (\d+) entries$/, function (numEntries) {
  var entries = base.find("div.pname");
  expect(entries).to.have.size(numEntries);
});

Given(/^no entries for "(.*?)" exist in doodle with ID "(.*?)"$/, function (name, doodleId) {
  openDoodle(doodleId);
  
  var entries = base.find("div.pname").withText(name);
  deleteEntries(entries);
});

Given(/^no entries exist in doodle with ID "(.*?)"$/, function (doodleId) {
  openDoodle(doodleId);
  
  var entries = base.find("div.pname");
  deleteEntries(entries);
});

Given(/^I have doodle with ID "(.*?)"$/, function (name, doodleId) {
  openDoodle(doodleId);
  
  var entries = base.find("div.pname").withText(name);
  deleteEntries(entries);
});

