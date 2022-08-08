import { useRouter } from 'next/router';
import 'isomorphic-fetch';
import { useState, useEffect } from "react";
import {DisplayRows, DisplayTweet1} from "../../components";
import {Checkbox, follow_unfollow, maxresult_row, half_paging} from "../../components/hooks";

export default function Tweets() {
    const router = useRouter();
    const {id} = router.query;
    const [data, setData] = useState();
    const [users, setUsers] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [MaxResultRow, max_results,num_of_rows] = maxresult_row(100, 3);
    const [FollowUnfollow] = follow_unfollow(id);
    
    const [Paging, 
        nextToken,setNextToken,
        count,setCount] = half_paging(onClickStart, onClickNext);

    useEffect(() => {
        onClickStart();
    }, [id]);

    function onClickStart() {
        onNewTweet(id, null, true);
    }    
    
    function onClickNext() {
        onNewTweet(id, nextToken, false);
    }

    function onNewTweet(id, token, isStart) {   
        fetch("/liked_tweets", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: id,
              next_token: token,
              max_results: max_results,
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                setData(result.data);
                setUsers(result.includes.users);
                
                result.meta.next_token ? 
                    setNextToken(result.meta.next_token) :
                    setNextToken(null)
                
                if (result.data){
                    if (isStart) {
                        setCount(result.data.length);
                    } else {
                        setCount(count + result.data.length);
                    }
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
                    <MaxResultRow />
                    <div class="level-right">
                        <div class="level-item"><CheckboxHashtag /></div>
                    </div>
                </div>
                <DisplayRows data={data} users={users} num_of_rows={num_of_rows} DisplayTweet={DisplayTweet1} checkedHashtag={checkedHashtag} />                    
            </div>
        </section>
    )
}


    
