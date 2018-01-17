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
      request.on('error', (err: Error) => reject(err))
    }).catch((err: Error) => {
        throw err;
    })
};

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
                    resolve(moderator)
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
 * @method: Return the return specific data from a moderator
 * @argument {string}: username of the moderator
 * @returns Promise object array of utopian moderators
 */
export function getSponsor(username: string): Promise<Sponsor> {
   
    return new Promise<Sponsor>((resolve, reject) => {
        getSponsors().then((sponsors: Sponsors) => {
            sponsors.results.filter((sponsor: Sponsor) => {
                if (sponsor.account === username && sponsor.banned === false && sponsor.reviewed === true) {
                    resolve(sponsor)
                }
                else reject(false);
            });
        });
    });
};

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



