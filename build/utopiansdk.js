"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }).catch(function (err) {
        throw err;
    });
};
var encodeQueryData = function (parameters) {
    var ret = [];
    for (var d in parameters)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
};
/**
 * @method: Return the moderators of Utopian
 * @returns Promise object array of utopian moderators
 */
function getModerators() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_MODERATORS).then(function (data) {
            resolve(JSON.parse(data));
        }).catch(function (err) { return reject(err); });
    });
}
exports.getModerators = getModerators;
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
/**
 * @method: Return the sponsors of Utopian
 * @returns Promise object array of utopian sponsors
 */
function getSponsors() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_SPONSORS).then(function (data) {
            resolve(JSON.parse(data));
        }).catch(function (err) { return reject(err); });
    });
}
exports.getSponsors = getSponsors;
/**
 * @method: Return the return specific data from a Sponsor
 * @argument {string}: username of the sponsor
 * @returns Promise object array of utopian sponsor
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
/**
 * @method: Return list of posts in a given query
 * @argument {string}: query for the data
 * @returns Promise object array of posts
 */
function getPosts(options) {
    if (!options)
        options = {};
    if (options.limit > 20 || options.limit < 1) {
        options.limit = 20;
    }
    if (Object.keys(options).length === 0) {
        options.limit = 20;
        options.skip = 0;
    }
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_POSTS.concat('?').concat(encodeQueryData(options))).then(function (data) {
            resolve(JSON.parse(data));
        }).catch(function (err) { return reject(err); });
    });
}
exports.getPosts = getPosts;
/**
 * @method: Return list of pending posts by moderator and category in a given query
 * @argument {string} moderator: moderator to query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise object array of posts
 */
function getPendingPostsByModeratorAndCategory(moderator, category, options) {
    return new Promise(function (resolve, reject) {
        getPosts(Object.assign({
            section: 'all',
            sortBy: 'created',
            filterBy: 'review',
            status: 'any',
            type: category
        }, options)).then(function (posts) {
            resolve(posts.results.filter(function (post) {
                return post.moderator === moderator;
            }));
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getPendingPostsByModeratorAndCategory = getPendingPostsByModeratorAndCategory;
/**
 * @method: Return count of pending posts by a given category in a given query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
function getPendingPostsByCategory(category, options) {
    return new Promise(function (resolve, reject) {
        getPosts(Object.assign({
            sortBy: 'created',
            filterBy: 'review',
            type: category
        }, options)).then(function (posts) {
            resolve(posts.total);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getPendingPostsByCategory = getPendingPostsByCategory;
/**
 * @method: Return count of pending posts by a given query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
function getPendingPosts(options) {
    return new Promise(function (resolve, reject) {
        getPosts(Object.assign({
            sortBy: 'created',
            filterBy: 'review'
        }, options)).then(function (posts) {
            resolve(posts.total);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getPendingPosts = getPendingPosts;
/**
 * @method: Return list of the pending posts of the given moderator
 * @argument {string} moderator: moderator to query
 * @returns Promise object array of posts
 */
function getPendingPostsByModerator(moderator) {
    return new Promise(function (resolve, reject) {
        getPosts({
            section: 'all',
            sortBy: 'created',
            filterBy: 'review',
            status: 'pending',
            moderator: moderator,
            type: 'all'
        }).then(function (posts) {
            resolve(posts);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getPendingPostsByModerator = getPendingPostsByModerator;
/**
 * @method: Return count of all pending posts
 * @returns Promise type number
 */
function getPendingPostsCount() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_POSTS.concat('?'.concat(encodeQueryData({ filterBy: 'review', limit: 1, skip: 0 }))))
            .then(function (posts) {
            if (!posts)
                reject(false);
            else
                resolve(JSON.parse(posts).total);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getPendingPostsCount = getPendingPostsCount;
/**
 * @method: Return count of all posts
 * @returns Promise type number
 */
function getTotalPostCount() {
    return new Promise(function (resolve, reject) {
        getURL(ENDPOINT_POSTS.concat('?'.concat(encodeQueryData({ limit: 1, skip: 0 }))))
            .then(function (posts) {
            if (!posts)
                reject(false);
            else
                resolve(JSON.parse(posts).total);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.getTotalPostCount = getTotalPostCount;
