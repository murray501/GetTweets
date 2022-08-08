import { createChunks, saveJSON, getLocalTime, DisplayFollowing, loadJSON, removeHashtag } from ".";
import Link from 'next/link';
import {Checkbox, set_num_of_rows} from "./hooks";
import 'isomorphic-fetch';
import { useState, useEffect } from "react";

export function DisplayUsers({data, num_of_rows, tweets, checkedHashtag=null, remove=null, DisplayUser = f => f}) {
    
    const chunks = createChunks(data, num_of_rows);

    return (
        <div class="columns">
            {chunks.map(chunk => <DisplayUserRow chunk={chunk} tweets={tweets} checkedHashtag={checkedHashtag} remove={remove} DisplayUser={DisplayUser} />)}
        </div>
    )
}

function DisplayUserRow({chunk, tweets, checkedHashtag, remove, DisplayUser= f => f}) {
    return (
        <div class="column">
            {chunk.map(item => <DisplayUser user={item} tweets={tweets} checkedHashtag={checkedHashtag} remove={remove}/>)}
        </div>
    )
}


function Unfollow({userid, remove}) {
    function unfollow() {
        remove(userid);
    }

    return (
        <button class="level-item delete is-small" onClick={unfollow}></button>
    )
}

function Empty() {
    return (
        <></>
    )
}

export function DisplayUserBasic({user, tweets, checkedHashtag, remove=f =>f, Unfollow=f => f, FollowUnfollow = f => f}) {
    const pinned_tweet = tweets?.find(x => x.author_id === user.id);
    const user_url = "/tweets/" + user.id;

    let description = user.description;
    let pinned_tweet_text = pinned_tweet?.text;
    if (checkedHashtag) {
        description = removeHashtag(description);
        pinned_tweet_text = removeHashtag(pinned_tweet_text);
    }

    return (
        <div class="card block">
            <header class="card-header">
                <div class="card-header-title level">
                    <div class="level-left">
                        <div class="level-item">
                            <Link href={user_url}>
                                <a>{user.name}</a>
                            </Link>
                        </div>
                        <div class="level-item">
                            {getLocalTime(user.created_at)}
                        </div>
                    </div>
                    <div class="level-right">
                        <Unfollow userid={user.id} remove={remove} />
                        <FollowUnfollow userid={user.id} />
                    </div>
                </div>
            </header>
            <div class="card-content">
                <p class="content block">
                    <small>{description}</small>
                </p>
                {pinned_tweet ? 
                    <p class="content block">
                        <small>{pinned_tweet_text}</small>
                    </p> : 
                    <></>
                }
                <nav class="level is-mobile">
                    <div class="level-left">
                        <DisplayFollowing userid={user.id} />
                    </div>
                </nav>
            </div>
        </div>
    )    
}

export function DisplayUser({user, tweets, checkedHashtag, remove}) {
    return <DisplayUserBasic user={user} tweets={tweets} checkedHashtag={checkedHashtag} Unfollow={Unfollow} 
            remove={remove} FollowUnfollow={Empty} />
}

export function Users({storagename}) {
    const [data, setData] = useState();
    const [tweets, setTweets] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [NumOfRows, num_of_rows] = set_num_of_rows(3);
     
    function remove(id) {
        const previous = loadJSON(storagename);
        const current = previous?.filter(x => x !== id);
        saveJSON(storagename, current);

        const newData = data.filter(x => x.id !== id);
        setData(newData);
    }

    function getUsers(ids) {
        if (!ids) return;
        fetch('/users', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ids: ids.join()   
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                setData(result.data);
                setTweets(result?.includes?.tweets);
            } else {
                alert(await res.text())
            }
        })
    }

    useEffect(() => {
        const ids = loadJSON(storagename);
        getUsers(ids);
    }, []);

    if (!data) return;
    
    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level box">
                    <div class="level-left">
                        <NumOfRows />
                    </div>
                    <div class="level-right">
                        <div class="level-item"><CheckboxHashtag /></div>
                    </div>
                </div>    
                <DisplayUsers data={data} 
                            num_of_rows={num_of_rows} 
                            tweets={tweets} 
                            checkedHashtag={checkedHashtag} 
                            remove={remove} 
                            DisplayUser={DisplayUser}
                        />
            </div>
        </section>
    )
}
