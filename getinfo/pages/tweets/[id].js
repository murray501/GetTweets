import { useRouter } from 'next/router';
import 'isomorphic-fetch';
import { useState, useEffect } from "react";
import {DisplayRows, DisplayTweet2, DisplayFollowing} from "../../components";
import {Checkbox, follow_unfollow, maxresult_row, half_paging} from "../../components/hooks";

export default function Tweets() {
    const router = useRouter();
    const {id} = router.query; 
    const [userid, setUserID] = useState(id);
    const [data, setData] = useState();
    const [username, setUsername] = useState();
    const [uname, setUname] = useState();
    const [description, setDescription] = useState();
    const [CheckboxExclude, checkedExclude] = Checkbox("exclude reply/retweet ", true);
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [MaxResultRow, max_results,num_of_rows] = maxresult_row(100, 3);
    const [FollowUnfollow] = follow_unfollow(id);
    
    const [Paging, 
        nextToken,setNextToken,
        count,setCount] = half_paging(onClickStart, onClickNext);

    useEffect(() => {
        onClickStart();
    },[]);

    function onClickStart() {
        setCount(0);
        setNextToken(null);
        onNewTweet(userid, null);
    }    
    
    function onClickNext() {
        onNewTweet(userid, nextToken);
    }

    function onNewTweet(id, token) {   
        fetch("/tweets", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: id,
              next_token: token,
              max_results: max_results,
              isExclude: checkedExclude,  
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                setData(result.data);
                setUsername(result.includes.users[0].username);
                setUname(result.includes.users[0].name);
                setDescription(result.includes.users[0].description);
                
                result.meta.next_token ? 
                    setNextToken(result.meta.next_token) :
                    setNextToken(null)
                
                if (result.data){
                    setCount(count + result.data.length)
                }
                    
            } else {
                alert(await res.text())
            }
        })
    }

    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">userid: {userid}</div>
                        <div class="level-item"><CheckboxExclude /></div>
                        <div class="level-item"><CheckboxHashtag /></div>
                        <FollowUnfollow />
                    </div>
                    <Paging />
                </div>   
                <div class="level">
                    <MaxResultRow />
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">username: {username} </div>
                        <div class="level-item">name: {uname} </div>
                    </div>
                    <div class="level-right">
                        <DisplayFollowing userid={userid} />
                    </div>
                </div> 
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">description: {description}</div> 
                    </div>      
                </div>
                <DisplayRows data={data} users={null} num_of_rows={num_of_rows} DisplayTweet={DisplayTweet2} checkedHashtag={checkedHashtag} />                    
            </div>
        </section>
    )
}


    
