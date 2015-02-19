var expect        = require("expect-webelements"),
    timeUnits     = require("minium/timeunits"),
    _             = require("lodash"),
    Chance        = require('chance'),
    cucumberutils = require("cucumber/utils");

// Instantiate Chance so it can be used
var chance = new Chance();
    
var base = $(":root").unless(".loading:visible");
$(":root").configure()
  .waitingPreset("slow")
    .timeout(20, timeUnits.SECONDS)
  .done()
  .interactionListeners()
    .clear()
    .add(minium.interactionListeners.unhandledAlert().accept())
    .add(minium.interactionListeners.waitOnTimeout().unless(base).forExistence(base).withWaitingPreset("slow"));

When(/^I go to doodle with ID "(.*?)"$/, function (doodleId) {
  browser.get("http://doodle.com/" + doodleId);
});

When(/^I fill my name with "(.*?)"$/, function (name) {
  $("#pname").fill(name);
});

When(/^I fill an entry with random data$/, function () {
  var randomName = chance.name();
  var nameFld    = $("#pname");
  var checkboxes = $(":checkbox").rightOf(nameFld); 
  nameFld.fill(randomName);
  
  var numSelected = chance.integer({min: 0, max: checkboxes.size() });
  for (var i = 0; i < numSelected; i++) {
    var index = chance.integer({min: 0, max: checkboxes.size() });
    checkboxes.eq(index).check();
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
    expect($(".green").eq(i)).to.have.text(line);
  });
});

Given(/^no entries for "(.*?)" exist in doodle with ID "(.*?)"$/, function (name, doodleId) {
  browser.get("http://doodle.com/" + doodleId);
  
  var entry = base.find("div.pname").withText(name).first();
  base.waitForExistence();
  
  while (entry.checkForExistence("immediate")) {
    var deleteIcon    = base.find(".inlineDeleteIcon").leftOf(entry);
    var confirmDelete = base.find("#btn-yes");
    
    entry.moveTo();
    deleteIcon.click();
    confirmDelete.click();
    
    base.waitForExistence();
  }
});
