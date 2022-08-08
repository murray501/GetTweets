import React, { useState } from "react";
import parse from "html-react-parser";
import Link from 'next/link';
import { useInput, Bookmark, BookmarkSpace, RemovePerson, AddPerson } from "./hooks";
import { useRouter } from 'next/router';

export const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
export const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export function SearchForm({ onNewSearch = f => f }) {
  const [titleProps, resetTitle] = useInput("");

  const submit = e => {
    e.preventDefault();
    onNewSearch(titleProps.value);
    resetTitle();
  };

  return (
    <form onSubmit={submit}>
      <input
        {...titleProps}
        type="text"
        placeholder="search word..."
        required
      />
      <button>Word</button>
    </form>
  );
}

export function DefineNumRows({onNewDefine = f => f }) {
  const [num_of_rows, resetNumofrows] = useInput("");

  const submit = e => {
    e.preventDefault();
    onNewDefine(num_of_rows.value);
  };

  return (
    <form onSubmit={submit}>
      <input
        {...num_of_rows}
        type="text"
        placeholder="num_of_rows..."
        required
      />
      <button>Change values</button>
    </form>
  );
}

export function DefineRows({onNewDefine = f => f }) {
  const [max_results, resetMaxresults] = useInput("");
  const [num_of_rows, resetNumofrows] = useInput("");

  const submit = e => {
    e.preventDefault();
    onNewDefine(max_results.value, num_of_rows.value);
  };

  return (
    <form onSubmit={submit}>
      <input
        {...max_results}
        type="text"
        placeholder="max_results..."
        required
      />
      <input
        {...num_of_rows}
        type="text"
        placeholder="num_of_rows..."
        required
      />
      <button>Change values</button>
    </form>
  );
}

export function DefineRows2({onNewDefine = f => f }) {
  const [num_of_rows, resetNumofrows] = useInput("");

  const submit = e => {
    e.preventDefault();
    onNewDefine(num_of_rows.value);
  };

  return (
    <form onSubmit={submit}>
      <input
        {...num_of_rows}
        type="text"
        placeholder="num_of_rows..."
        required
      />
      <button>Change values</button>
    </form>
  );
}

export function myInput(initvalue, label) {
  const [titleProps, _] = useInput(initvalue);

  return [
      () =>
      <label>
        {label}
        <input
          {...titleProps}
          type="text"
          required
        />
      </label> 
      ,
      titleProps.value
  ];
}

export function DisplayRows({data, users, num_of_rows, DisplayTweet, checkedHashtag}) {
  if (!data) {
    return (
      <div>no data</div>
    )
  }

  const rows = createChunks(data, num_of_rows);

  return (
      <div class="columns">
      {
          rows.map( row =>
                  <DisplayRow 
                    data={row} 
                    users={users} 
                    DisplayTweet={DisplayTweet} 
                    checkedHashtag={checkedHashtag} 
                  />
          )
      }
      </div>
  )
}

function DisplayRow({data, users, DisplayTweet, checkedHashtag}) {
  return (
      <div class="column">
          {data?.map(item => <DisplayTweet item={item} users={users} checkedHashtag={checkedHashtag} />)}
      </div>
  )
}

export function DisplayTweet1({item, users, checkedHashtag}) {
  const user = users?.find(user => user.id === item.author_id);
  const user_url = "/tweets/" + item.author_id;
  const liking_users = "/liking_users/" + item.id;
  const retweeted_by = "/retweeted_by/" + item.id;

  let text = parse(item.text);
  if (checkedHashtag) {
      text = removeHashtag(text);
  }
  return (
      <article class="media box">
          <div class="media-content">
              <div class="content">
                  <p>
                      <Link href={user_url}>
                          <a>{user?.name}</a>
                      </Link> 
                      <br />
                      <small>{getLocalTime(item.created_at)}</small>
                      <br />
                      {text}
                  </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <Link href={retweeted_by}>
                    <a class="level-item">
                      <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                    </a>                    
                  </Link>
                  <Link href={liking_users}> 
                    <a class="level-item">
                      <span class="icon is-small"><i class="fas fa-heart"></i></span>
                    </a>
                  </Link>
                  <Bookmark id={item.id} />
                  <AddPerson userid={item.author_id} />
                  <RemovePerson userid={item.author_id} />
                </div>
              </nav>
          </div>
      </article>
  )
}    

export function DisplayTweet2({item, checkedHashtag}) {
  const liking_users = "/liking_users/" + item.id;
  const retweeted_by = "/retweeted_by/" + item.id;
  let text = parse(item.text);
  if (checkedHashtag) {
      text = removeHashtag(text);
  }
  return (
      <article class="media box">
          <div class="media-content">
              <div class="content">
                  <p>
                    <small>{getLocalTime(item.created_at)}</small>
                    <br />
                    {text}
                  </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <Link href={retweeted_by}>
                    <a class="level-item">
                      <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                    </a>                    
                  </Link>
                  <Link href={liking_users}> 
                    <a class="level-item">
                      <span class="icon is-small"><i class="fas fa-heart"></i></span>
                    </a>
                  </Link>
                  <Bookmark id={item.id} />
                </div>
              </nav>
          </div>
      </article>
  )
}    

export function DisplaySpace({item, users, checkedHashtag}) {
  const user = users?.find(user => user.id === item.creator_id);
  const user_url = "/tweets/" + item.creator_id;

  let description = user?.description;
  if (checkedHashtag) {
      description = removeHashtag(description);
  }
  
  return (
      <article class="media box">
          <div class="media-content">
              <div class="content">
                  <div class="notification">
                    <small>{item?.title}</small>
                  </div>
                  <p>
                    <Link href={user_url}>
                          <a>{user?.name}</a>
                    </Link>
                    <br /> 
                    <small>{description}</small>
                  </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <small class="level-item">{getLocalTime(item.scheduled_start)}</small>
                  <small class="level-item">{item.lang}</small>
                  <small class="level-item">state: {item.state}</small>
                  <small class="level-item">pcount:{item.participant_count}</small>
                  <small class="level-item">ticket:{item.is_ticketed ? 'yes' : 'no'}</small>
                  <small class="level-item">scount:{item.subscriber_count}</small>
                </div>
              </nav>
              <nav class="level is-mobile">
                <div class="level-left">
                  <BookmarkSpace id={item.id} />
                  <AddPerson userid={item.creator_id} />
                  <RemovePerson userid={item.creator_id} />
                  <SpaceUser type="invited" itemid={item.id} ids={item.invited_user_ids} />
                  <SpaceUser type="hosts" itemid={item.id} ids={item.host_ids} />
                  <SpaceUser type="speakers" itemid={item.id} ids={item.speaker_ids} />                 
                </div>
              </nav>
          </div>
      </article>
  )
}  

function SpaceUser({type, itemid, ids}) {
  const router = useRouter();
  const count = ids?.length;

  return (
    <button class="button level-item is-small" 
      onClick={() => {
        saveJSON("spaceusers", ids);
        router.push({
          pathname: '/spaceusers',
          query: { type: type, itemid: itemid }
        })
      }}>{type} ({count})</button>
  )
}

export function DisplayFollowing({userid}) {
  const following_url = "/following/" + userid;
  const follower_url = "/follower/" + userid;
  const liked_tweets_url = "/liked_tweets/" + userid;
  return (
    <>
    <Link href={following_url}>
      <a class="level-item"><span>following</span></a>
    </Link>
    <Link href={follower_url}>
      <a class="level-item"><span>followers</span></a>
    </Link>
    <Link href={liked_tweets_url}>
      <a class="level-item"><span>liked_tweets</span></a>
    </Link>  
    </>
  )
}

export function removeHashtag(str) {
  const stringArray = str?.split(/\s+/);
  const filtered = stringArray?.filter(x => x[0] !== '#' && x[0] !== ' ' && !x.includes('@'));
  return filtered?.join(' ');
}

export function getLocalTime(str) {
  const dt = new Date(str);
  const localtime = dt.toLocaleString();
  return localtime;
}

export function createChunks(data, num_of_rows) {
  const arr = [];
  for (let i = 0; i < num_of_rows; i++) {
      arr.push([]);
  }
  data?.map((item, index) => {
      const seq = index % num_of_rows;
      arr[seq].push(item);
  })
  return arr;
}

