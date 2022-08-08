import 'isomorphic-fetch';
import {useState} from "react";
import {SearchForm} from "../../components";
import {set_num_of_rows, follow_unfollow} from '../../components/hooks';
import {DisplayUsers, DisplayUserBasic} from '../../components/users';

export default function SearchUsers() {
    const [data, setData] = useState();
    const [tweets, setTweets] = useState();
    const [NumOfRows, num_of_rows] = set_num_of_rows(3);
    const [usernames, setUsernames] = useState();

    function getUsers() {
        fetch('/usersbyname', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              usernames: usernames.join()   
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                setData(result.data);
                setTweets(result?.includes?.tweets);
                console.log(result?.includes?.tweets);
            } else {
                alert(await res.text())
            }
        })
    }

    function onSearch() {
        getUsers();
    }

    function setSearchWord(word) {
        if (usernames) {
            const newnames = [...usernames, word];
            setUsernames(newnames);
        } else {
            setUsernames([word]);
        }
    }

    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <SearchForm onNewSearch={setSearchWord} />    
                        </div>
                    </div>
                    <div class="level-item">usernames: {usernames?.join()}</div>
                    <div class="level-right">
                        <button class="button level-item" onClick={onSearch} >Search</button>
                    </div>
                </div>
                <div class="level">
                    <NumOfRows />
                </div>  
                {data ? 
                <DisplayUsers data={data} 
                    num_of_rows={num_of_rows} 
                    tweets={tweets} 
                    DisplayUser={DisplayUser}
                /> : <></>
                }  
            </div>
        </section>
    )
}

function Empty() {
    return (
        <></>
    )
}

function DisplayUser({user, tweets, checkedHashtag, remove}) {
    const [FollowUnfollow] = follow_unfollow(user.id);

    return <DisplayUserBasic user={user} tweets={tweets} checkedHashtag={null} Unfollow={Empty} 
            remove={null} FollowUnfollow={FollowUnfollow} />
}

