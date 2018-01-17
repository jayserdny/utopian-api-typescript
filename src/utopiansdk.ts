const API_HOST = "https://api.utopian.io/api";
const ENDPOINT_MODERATORS = API_HOST + '/moderators';
const ENDPOINT_SPONSORS = API_HOST + '/sponsors';
const ENDPOINT_POSTS = API_HOST + '/posts';
const POST_TYPE_TRANSLATIONS = "translations";
const POST_TYPE_DEVELOPMENT = "development";
const POST_TYPE_BUGHUNTING = "bug-hunting";
const POST_TYPE_DOCUMENTATION = "documentation";

const getURL = function(url: string) {
    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = url.startsWith('https') ? require('https') : require('http');
      const request = lib.get(url, (response: any) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
           reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }
        // temporary data holder
        const body: Array<any> = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk: any) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });
      // handle connection errors of the request
      request.on('error', (err: Error) => reject(err));
    }).catch((err: Error) => {
        throw err;
    });
};

const encodeQueryData = function(parameters: any) {
    let ret = [];
    for (let d in parameters)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
 }

/**
 * @method: Return the moderators of Utopian
 * @returns Promise object array of utopian moderators
 */
export function getModerators(): Promise<Moderators> {
   
    return new Promise((resolve, reject) => {
        getURL(ENDPOINT_MODERATORS).then((data: any) => {
            resolve(JSON.parse(data));
        }).catch((err) => reject(err));
    });
};

/**
 * @method: Return the return specific data from a moderator
 * @argument {string}: username of the moderator
 * @returns Promise object array of utopian moderators
 */
export function getModerator(username: string): Promise<Moderator> {
   
    return new Promise<Moderator>((resolve, reject) => {
        getModerators().then((moderators: Moderators) => {
            moderators.results.filter((moderator: Moderator) => {
                if (moderator.account === username && moderator.banned === false && moderator.reviewed === true) {
                    resolve(moderator);
                }
                else reject(false);
            });
        });
    });
};

/**
 * @method: Return the sponsors of Utopian
 * @returns Promise object array of utopian sponsors
 */
export function getSponsors(): Promise<Sponsors> {
   
    return new Promise<Sponsors>((resolve, reject) => {
        getURL(ENDPOINT_SPONSORS).then((data: any) => {
            resolve(JSON.parse(data));
        }).catch((err) => reject(err));
    });
};

/**
 * @method: Return the return specific data from a Sponsor
 * @argument {string}: username of the sponsor
 * @returns Promise object array of utopian sponsor
 */
export function getSponsor(username: string): Promise<Sponsor> {
   
    return new Promise<Sponsor>((resolve, reject) => {
        getSponsors().then((sponsors: Sponsors) => {
            sponsors.results.filter((sponsor: Sponsor) => {
                if (sponsor.account === username && sponsor.banned === false && sponsor.reviewed === true) {
                    resolve(sponsor);
                }
                else reject(false);
            });
        });
    });
};

/**
 * @method: Return list of posts in a given query
 * @argument {string}: query for the data
 * @returns Promise object array of posts
 */
export function getPosts(options: Options): Promise<Posts> {
    if (!options) options = {};

    if (options.limit > 20 || options.limit < 1) {
        options.limit = 20;
    }

    if (Object.keys(options).length === 0) {
        options.limit = 20;
        options.skip = 0;
    }

    return new Promise<Posts>((resolve, reject) => {
        getURL(ENDPOINT_POSTS.concat('?').concat(encodeQueryData(options))).then((data: any) => {
            resolve(JSON.parse(data));
        }).catch((err) => reject(err));
    });
};

/**
 * @method: Return list of pending posts by moderator and category in a given query
 * @argument {string} moderator: moderator to query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise object array of posts
 */
export function getPendingPostsByModeratorAndCategory(moderator: string, category: string, options: Options): Promise<Array<Post>> {
    return new Promise<Array<Post>>((resolve, reject) => {
        getPosts(Object.assign({
            section: 'all',
            sortBy: 'created',
            filterBy: 'review',
            status: 'any',
            type: category
        }, options)).then((posts: Posts) => {
            resolve(posts.results.filter((post: Post) => {
                return post.moderator === moderator;
            }));
        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * @method: Return count of pending posts by a given category in a given query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
export function getPendingPostsByCategory(category: string, options: Options): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        getPosts(Object.assign({
            sortBy: 'created',
            filterBy: 'review',
            type: category
        }, options)).then((posts: Posts) => {
            resolve(posts.total);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * @method: Return count of pending posts by a given query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
export function getPendingPosts(options: Options): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        getPosts(Object.assign({
             sortBy: 'created',
            filterBy: 'review'
        }, options)).then((posts: Posts) => {
            resolve(posts.total);

        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * @method: Return list of the pending posts of the given moderator
 * @argument {string} moderator: moderator to query
 * @returns Promise object array of posts
 */
export function getPendingPostsByModerator(moderator: string): Promise<Posts> {
    return new Promise<Posts>((resolve, reject) => {
        getPosts({
            section: 'all',
            sortBy: 'created',
            filterBy: 'review',
            status: 'pending',
            moderator: moderator,
            type: 'all'
        }).then((posts: Posts) => {
            resolve(posts);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * @method: Return count of all pending posts
 * @returns Promise type number
 */
export function getPendingPostsCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        getURL(ENDPOINT_POSTS.concat('?'.concat(encodeQueryData({filterBy: 'review', limit: 1, skip: 0}))))
        .then((posts: any) => {
            if (!posts) reject(false);
            else resolve(JSON.parse(posts).total);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * @method: Return count of all posts
 * @returns Promise type number
 */
export function getTotalPostCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        getURL(ENDPOINT_POSTS.concat('?'.concat(encodeQueryData({limit: 1, skip: 0}))))
        .then((posts: any) => {
            if (!posts) reject(false);
            else resolve(JSON.parse(posts).total);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};

/**
 * INTERFACES AREA
 */

export interface Posts {
    total: number;
    results: Array<Post>;
};

export interface Post {
    moderator: string;
    flagged: boolean,
    reviewed: boolean,
    pending: boolean,
    _id: string;
    id: number,
    author: string;
    permlink: string;
    category: string;
    parent_author: string;
    parent_permlink: string;
    title: string;
    body: string;
    json_metadata: { 
        moderator: Object;
        links: Array<string>;
        tags: Array<string>;
        type: string;
        platform: string;
        pullRequests: Array<string>,
        repository: [Object],
        format: string;
        app: string;
        community: string; 
    },
    last_update: string;
    created: string;
    active: string;
    last_payout: string;
    depth: number;
    children: number;
    net_rshares: number;
    abs_rshares: number;
    vote_rshares: number;
    children_abs_rshares: number;
    cashout_time: string;
    max_cashout_time: string;
    total_vote_weight: number;
    reward_weight: number;
    total_payout_value: string;
    curator_payout_value: string;
    author_rewards: number;
    net_votes: number;
    root_comment:number;
    max_accepted_payout: string;
    percent_steem_dollars: number;
    allow_replies: boolean;
    allow_votes: boolean;
    allow_curation_rewards: boolean;
    url: string;
    root_title: string;
    pending_payout_value: string;
    total_pending_payout_value: string;
    author_reputation: number;
    promoted: string;
    body_length: number;
    __v: number;
    reserved: boolean;
    replies: Array<string>;
    reblogged_by: Array<string>;
    beneficiaries: Array<Object>;
    active_votes: Array<Object>
};

export interface Options {
    moderator?: string;
    limit?: number;
    skip?: number;
    section?: string;
    sortBy?: string;
    filterBy?: string;
    status?: string;
    type?: string;
};

export interface Sponsors {
    total: number;
    results: Array<Sponsor>;
};

export interface Sponsor extends Moderator {
    vesting_shares: number;
    percentage_total_vesting_shares: number;
    is_witness: boolean;
    __v: number;
    opted_out: boolean;
    projects: Array<string>;
    json_metadata: Object;
};

export interface Moderators {
    total: number;
    results: Array<Moderator>;
};

export interface Moderator {
    _id: string;
    account: string;
    total_paid_rewards: number;
    should_receive_rewards: number;
    total_moderated: number;
    percentage_total_rewards_moderators: number;
    reviewed: boolean;
    banned: boolean;
    supermoderator: boolean;
    total_paid_rewards_steem: boolean;
};