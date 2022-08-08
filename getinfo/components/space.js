import 'isomorphic-fetch';
import {useState} from "react";
import {DisplayRows, DisplaySpace, loadJSON} from "./index";
import {Checkbox, maxresult_row, half_paging} from "./hooks";

export function SpaceResult({query}) {
    const [data, setData] = useState();
    const [users, setUsers] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [MaxResultRow, max_results,num_of_rows] = maxresult_row(100, 3);
    const [Paging, 
        nextToken,setNextToken,
        count,setCount] = half_paging(onClickStart, onClickNext);
   
    function onClickStart() {
        onSearch(null, true);
    }    
    
    function onClickNext() {
        onSearch(nextToken, false);
    }

    function onSearch(nextToken, isStart) {
        fetch('/space', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: query,
              next_token: nextToken,
              max_results: max_results  
            })
        })
        .then(async res => {
            if (res.ok) {   
                const result = await res.json();
                
                setData(result?.data);
                setUsers(result?.includes?.users);
                if (result.meta.next_token) {
                    setNextToken(result.meta.next_token);
                }
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
        <>
            <div class="level">
                <MaxResultRow />
                <div class="level-item"><CheckboxHashtag /></div>
                <Paging />
            </div>
            <DisplayRows data={data} users={users} num_of_rows={num_of_rows} DisplayTweet={DisplaySpace} checkedHashtag={checkedHashtag} />            
        </>
    )
}




