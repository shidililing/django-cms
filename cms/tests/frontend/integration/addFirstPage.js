'use strict';

// #############################################################################
// Create the first page

var globals = require('./settings/globals');
var content = require('./settings/globals').content.page;
var cms = require('./helpers/cms')();

casper.test.setUp(function (done) {
    casper.start()
        .then(cms.login())
        .run(done);
});

casper.test.tearDown(function (done) {
    casper.start()
        .then(cms.removePage())
        .then(cms.logout())
        .run(done);
});

casper.test.begin('Add First Page with wizard', function (test) {
    casper
        .start(globals.editUrl)
        .waitForSelector('.cms-ready')
        .waitUntilVisible('.cms-modal', function () {
            this.click('.cms-modal .cms-modal-close');
        })
        .waitWhileVisible('.cms-modal', function () {
            test.assertNotVisible('.cms-modal', 'The wizard pop up is closed');

            this.click('.js-welcome-add');
        })
        .waitUntilVisible('.cms-modal', function () {
            test.assertVisible('.cms-modal', 'The wizard pop up is opened');

            this.click('.cms-modal-buttons .cms-btn-action');
        })
        .withFrame(0, function () {
            test.assertExists('#id_1-title', 'The page creation wizard form is available');

            this.fill('.cms-content-wizard form', {
                '1-title': content.title,
                '1-content': content.text
            }, true);
        })
        .waitForSelector('.cms-ready', function () {
            test.assertSelectorHasText('.cms-plugin', content.text,
                'The new page has been created and its content is correct');

            // handles confirm popup
            this.setFilter('page.confirm', function () {
                return true;
            });

            this.click('.cms-btn-publish');
        })
        .waitForSelector('.cms-btn-switch-edit', function () {
            test.assertExists('.cms-btn-switch-edit', 'The new page has been published');
        })
        .run(function () {
            this.removeAllFilters('page.confirm');
            test.done();
        });
});
