/**
 * @method: Return the moderators of Utopian
 * @returns Promise object array of utopian moderators
 */
export declare function getModerators(): Promise<Moderators>;
/**
 * @method: Return the return specific data from a moderator
 * @argument {string}: username of the moderator
 * @returns Promise object array of utopian moderators
 */
export declare function getModerator(username: string): Promise<Moderator>;
/**
 * @method: Return the sponsors of Utopian
 * @returns Promise object array of utopian sponsors
 */
export declare function getSponsors(): Promise<Sponsors>;
/**
 * @method: Return the return specific data from a Sponsor
 * @argument {string}: username of the sponsor
 * @returns Promise object array of utopian sponsor
 */
export declare function getSponsor(username: string): Promise<Sponsor>;
/**
 * @method: Return list of posts in a given query
 * @argument {string}: query for the data
 * @returns Promise object array of posts
 */
export declare function getPosts(options: Options): Promise<Posts>;
/**
 * @method: Return list of pending posts by moderator and category in a given query
 * @argument {string} moderator: moderator to query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise object array of posts
 */
export declare function getPendingPostsByModeratorAndCategory(moderator: string, category: string, options: Options): Promise<Array<Post>>;
/**
 * @method: Return count of pending posts by a given category in a given query
 * @argument {string} category: category to query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
export declare function getPendingPostsByCategory(category: string, options: Options): Promise<number>;
/**
 * @method: Return count of pending posts by a given query
 * @argument {Options} options: query for the posts
 * @returns Promise type number
 */
export declare function getPendingPosts(options: Options): Promise<number>;
/**
 * @method: Return list of the pending posts of the given moderator
 * @argument {string} moderator: moderator to query
 * @returns Promise object array of posts
 */
export declare function getPendingPostsByModerator(moderator: string): Promise<Posts>;
/**
 * @method: Return count of all pending posts
 * @returns Promise type number
 */
export declare function getPendingPostsCount(): Promise<number>;
/**
 * @method: Return count of all posts
 * @returns Promise type number
 */
export declare function getTotalPostCount(): Promise<number>;
/**
 * INTERFACES AREA
 */
export interface Posts {
    total: number;
    results: Array<Post>;
}
export interface Post {
    moderator: string;
    flagged: boolean;
    reviewed: boolean;
    pending: boolean;
    _id: string;
    id: number;
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
        pullRequests: Array<string>;
        repository: [Object];
        format: string;
        app: string;
        community: string;
    };
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
    root_comment: number;
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
    active_votes: Array<Object>;
}
export interface Options {
    moderator?: string;
    limit?: number;
    skip?: number;
    section?: string;
    sortBy?: string;
    filterBy?: string;
    status?: string;
    type?: string;
}
export interface Sponsors {
    total: number;
    results: Array<Sponsor>;
}
export interface Sponsor extends Moderator {
    vesting_shares: number;
    percentage_total_vesting_shares: number;
    is_witness: boolean;
    __v: number;
    opted_out: boolean;
    projects: Array<string>;
    json_metadata: Object;
}
export interface Moderators {
    total: number;
    results: Array<Moderator>;
}
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
}
