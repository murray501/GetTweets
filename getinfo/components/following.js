import { useRouter } from 'next/router';
import 'isomorphic-fetch';
import { useState, useEffect } from "react";
import {loadJSON, saveJSON, createChunks, getLocalTime, removeHashtag, DisplayFollowing} from "./index";
import {Checkbox, paging, maxresult_row} from "./hooks";
import Link from 'next/link';

export function Following({fetchcmd = "/following"}) {
    const [data, setData] = useState();
    const [tweets, setTweets] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [MaxResultRows, max_results, num_of_rows] = maxresult_row(100, 3); 
    
    const router = useRouter();
    const {id} = router.query;
        
    const [Paging, 
        nextToken,setNextToken,
        previousToken,setPreviousToken,
        count,setCount] = paging(onClickStart, onClickPrev, onClickNext);

    useEffect(() => {
        onClickStart();
    }, [id]);

    function onClickStart() {
        getFollowing(id, null, "start");
    }    

    function onClickPrev() {
        getFollowing(id, previousToken, "prev");
    }

    function onClickNext() {
        getFollowing(id, nextToken, "next");
    }

    function follow(id) {
        const previous = loadJSON('follow');
        if (previous?.includes(id)) {
            return;
        }
        previous?.unshift(id);
        saveJSON('follow', previous ? previous : [id]);
    }

    function getFollowing(id, token, state) {
        if (state === "prev") {
            setCount(count - data?.length);
        }
        fetch(fetchcmd, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: id,
              max_results: max_results,
              next_token: token,
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                setData(result.data);
                setTweets(result?.includes?.tweets);
                result.meta.next_token ? 
                    setNextToken(result.meta.next_token) :
                    setNextToken(null)
            
                result.meta.previous_token ?
                    setPreviousToken(result.meta.previous_token) :
                    setPreviousToken(null) 
                
                if (state === "start") {
                    setCount(result?.data?.length);
                } else if (state === "next") {
                    setCount(count + result?.data?.length);
                }  
            } else {
                alert(await res.text())
            }
        })
    }

    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level box">
                    <MaxResultRows />
                    <div class="level-item"><CheckboxHashtag /></div>
                    <Paging />
                </div>
                {data ?  
                <DisplayUsers data={data} 
                            num_of_rows={num_of_rows} 
                            tweets={tweets} 
                            follow={follow} 
                            checkedHashtag={checkedHashtag} 
                            DisplayUserRow={DisplayUserRow} 
                /> : <></> 
                }
            </div>
        </section>
    )
}

function DisplayUsers({data, num_of_rows, tweets, follow, checkedHashtag, DisplayUserRow}) {
    
    const chunks = createChunks(data, num_of_rows);

    return (
        <div class="columns">
            {chunks.map(chunk => <DisplayUserRow chunk={chunk} tweets={tweets} follow={follow} checkedHashtag={checkedHashtag} />)}
        </div>
    )
}

function DisplayUserRow({chunk, tweets, follow, checkedHashtag}) {
    return (
        <div class="column">
            {chunk.map(item => <DisplayUser user={item} tweets={tweets} follow={follow} checkedHashtag={checkedHashtag} />)}
        </div>
    )
}

function DisplayUser({user, tweets, follow, checkedHashtag}) {
    const pinned_tweet = tweets?.find(x => x.author_id === user.id);
    const user_url = "/tweets/" + user.id;
    const following_url = "/following/" + user.id;
    const follower_url = "/follower/" + user.id;

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
                        <button class="level-item is-small" onClick={() => follow(user.id)}>follow</button>
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


