"use strict";
exports.__esModule = true;
var API_HOST = "https://api.utopian.io/api";
var ENDPOINT_MODERATORS = API_HOST + '/moderators';
var ENDPOINT_SPONSORS = API_HOST + '/sponsors';
var ENDPOINT_POSTS = API_HOST + '/posts';
var POST_TYPE_TRANSLATIONS = "translations";
var POST_TYPE_DEVELOPMENT = "development";
var POST_TYPE_BUGHUNTING = "bug-hunting";
var POST_TYPE_DOCUMENTATION = "documentation";
var getURL = function (url) {
    // return new pending promise
    return new Promise(function (resolve, reject) {
        // select http or https module, depending on reqested url
        var lib = url.startsWith('https') ? require('https') : require('http');
        var request = lib.get(url, function (response) {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            var body = [];
            // on every content chunk, push it to the data array
            response.on('data', function (chunk) { return body.push(chunk); });
            // we are done, resolve promise with those joined chunks
            response.on('end', function () { return resolve(body.join('')); });
        });
        // handle connection errors of the request
        request.on('error', function (err) { return reject(err); });
    })["catch"](function (err) {
        throw err;
    });
};
/**
 * @method: Return the moderators of Utopian
 * @returns Promise object array of utopian moderators
 */
function getModerators() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_MODERATORS).then(function (data) {
            resolve(JSON.parse(data));
        })["catch"](function (err) { return reject(err); });
    });
}
exports.getModerators = getModerators;
;
/**
 * @method: Return the return specific data from a moderator
 * @argument {string}: username of the moderator
 * @returns Promise object array of utopian moderators
 */
function getModerator(username) {
    return new Promise(function (resolve, reject) {
        getModerators().then(function (moderators) {
            moderators.results.filter(function (moderator) {
                if (moderator.account === username && moderator.banned === false && moderator.reviewed === true) {
                    resolve(moderator);
                }
                else
                    reject(false);
            });
        });
    });
}
exports.getModerator = getModerator;
;
/**
 * @method: Return the sponsors of Utopian
 * @returns Promise object array of utopian sponsors
 */
function getSponsors() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_SPONSORS).then(function (data) {
            resolve(JSON.parse(data));
        })["catch"](function (err) { return reject(err); });
    });
}
exports.getSponsors = getSponsors;
;
/**
 * @method: Return the return specific data from a moderator
 * @argument {string}: username of the moderator
 * @returns Promise object array of utopian moderators
 */
function getSponsor(username) {
    return new Promise(function (resolve, reject) {
        getSponsors().then(function (sponsors) {
            sponsors.results.filter(function (sponsor) {
                if (sponsor.account === username && sponsor.banned === false && sponsor.reviewed === true) {
                    resolve(sponsor);
                }
                else
                    reject(false);
            });
        });
    });
}
exports.getSponsor = getSponsor;
;
