import 'isomorphic-fetch';
import { useState, useEffect } from "react";
import { loadJSON, DisplayRows} from "./index";
import {Checkbox, set_num_of_rows} from "./hooks";

export function BookmarkTweet({fetchurl, storage, displaytweet}) {
    const [data, setData] = useState();
    const [users, setUsers] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [NumOfRows, num_of_rows] = set_num_of_rows(3);
     
    function getBookmarks(ids) {
        if (!ids) return;
        fetch(fetchurl, {
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
                setUsers(result.includes.users);
            } else {
                alert(await res.text())
            }
        })
    }

    useEffect(() => {
        const ids = loadJSON(storage);
        getBookmarks(ids);
    }, []);

    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level">
                    <NumOfRows />
                    <div class="level-right">
                        <div class="level-item"><CheckboxHashtag /></div>
                    </div>
                </div>
                <DisplayRows data={data} users={users} num_of_rows={num_of_rows} DisplayTweet={displaytweet} checkedHashtag={checkedHashtag} />                    
            </div>
        </section>
    )
}
