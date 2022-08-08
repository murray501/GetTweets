import axios from "axios";

const token = process.env.BEARER_TOKEN;
const baseURL = "https://api.twitter.com/2/";
function create_headers(userAgent) {
 return {'authorization': `Bearer ${token}`, 'User-Agent': userAgent};
}

function create_config(url, params, headers) { 
    return {method: 'get', baseURL: baseURL, url: url, params: params, headers: headers};
}

export async function search(query, pagination_token, max_results) {
    console.log("query = " + query);
    const headers = create_headers("v2RecentSearchJS");
    let params = {
        'query': query,
        'max_results': max_results,
        'tweet.fields': "created_at",
        'expansions': 'author_id',
        'user.fields': 'description' 
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const config = create_config('/tweets/search/recent', params, headers);
    return await request(config);
}

export async function lookup_spaces(ids) {
    const headers = create_headers("v2SpaceLookupJS");
    let params = {
        'ids': ids,
        'space.fields': 'title,created_at,lang,participant_count,scheduled_start,is_ticketed,subscriber_count,host_ids,speaker_ids,invited_user_ids',
        'expansions': 'creator_id',
        'user.fields': 'description'
    };

    const url = `/spaces`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function searchSpace(query, pagination_token, max_results) {
    console.log("query_space = " + query);
    const headers = create_headers("v2SpaceSearchJS");
    let params = {
        'query': query,
        'max_results': max_results,
        'space.fields': 'title,created_at,lang,participant_count,scheduled_start,is_ticketed,subscriber_count,host_ids,speaker_ids,invited_user_ids',
        'expansions': 'creator_id',
        'user.fields': 'description'
    };
    
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    
    const config = create_config('/spaces/search', params, headers);
    return await request(config);
}

export async function tweets(id, pagination_token, max_results, isExclude) {
    const headers = create_headers("v2UserTweetsJS");
    let params = {
        'max_results': max_results,
        'tweet.fields': "created_at",
        'expansions': 'author_id',
        'user.fields': 'description'
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    if (isExclude) {
        params = {...params, 'exclude': 'replies,retweets'};
    }
    const url = `/users/${id}/tweets`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function liked_tweets(id, pagination_token, max_results) {
    const headers = create_headers("v2LikedTweetsJS");
    let params = {
        'max_results': max_results,
        'tweet.fields': "created_at",
        'expansions': 'author_id',
        'user.fields': 'description'
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const url = `/users/${id}/liked_tweets`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function lookup_tweets(ids) {
    const headers = create_headers("v2TweetLookupJS");
    let params = {
        'ids': ids,
        'tweet.fields': 'created_at',
        'expansions': 'author_id',
        'user.fields': 'description'
    };

    const url = `/tweets`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function liking_users(id, pagination_token, max_results) {
    const headers = create_headers("v2LikingUsersJS");
    let params = {
        "max_results": max_results,
        "user.fields": "description,created_at",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id" 
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const url = `/tweets/${id}/liking_users`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function retweeted_by(id, pagination_token, max_results) {
    const headers = create_headers("v2RetweetedByUsersJS");
    let params = {
        "max_results": max_results,
        "user.fields": "description,created_at",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id" 
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const url = `/tweets/${id}/retweeted_by`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function following(id, pagination_token, max_results) {
    const headers = create_headers("v2FollowingJS");
    let params = {
        "max_results": max_results,
        "user.fields": "description,created_at",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id" 
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const url = `/users/${id}/following`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function follower(id, pagination_token, max_results) {
    const headers = create_headers("v2FollowersJS");
    let params = {
        "max_results": max_results,
        "user.fields": "description,created_at",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id" 
    };
    if (pagination_token) {
        params = {...params, 'pagination_token': pagination_token};
    }
    const url = `/users/${id}/followers`;
    const config = create_config(url, params, headers);
    return await request(config);
}

export async function users(ids) {
    const headers = create_headers("v2UserLookupJS");
    const params = {
        "ids": ids,
        "user.fields": "created_at,description",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id"        
    }
    const url = '/users';
    const config = create_config(url, params, headers);
    return await request(config);    
}

export async function usersbyname(usernames) {
    const headers = create_headers("v2UserLookupJS");
    const params = {
        "usernames": usernames,
        "user.fields": "created_at,description",
        "tweet.fields": "author_id",
        "expansions": "pinned_tweet_id"        
    }
    const url = '/users/by';
    const config = create_config(url, params, headers);
    return await request(config);    
}

async function request(config) {
    const res = await axios.request(config);
    
    console.log(res?.data);
    console.log(res?.data?.includes?.users);
    
    return res.data;
} 