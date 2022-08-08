import 'isomorphic-fetch';
import parse from "html-react-parser";
import {useState, useEffect} from "react";
import {DisplayRows, DisplayTweet1, loadJSON, createChunks} from "./index";
import {Checkbox, maxresult_row, half_paging} from "./hooks";

function extractHash(str) {
    const stringArray = str?.split(/\s+/);
    const filtered = stringArray?.filter(x => x[0] === '#');
    return filtered;
}

function extractHashes(data) {
    const hashes =  data?.flatMap(item => {
        let text = parse(item.text);
        return extractHash(text)
    });
    let unique = [...new Set(hashes)];
    unique.sort();
    return unique;
}

function mergeHashes(previous, current) {
    if (!previous) {
        return current;
    }
    const hashes = [...previous, ...current];
    let unique = [...new Set(hashes)];
    unique.sort();
    return unique;
}

export function QueryResult({query, addQuery = f => f, removeQuery = f => f}) {
    const [data, setData] = useState();
    const [hashes, setHashes] = useState();
    const [users, setUsers] = useState();
    const [CheckboxHashtag, checkedHashtag] = Checkbox("remove #@ ");
    const [CheckboxRemoveUser, checkedRemoveUser] = Checkbox("remove user ");
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
        fetch('/search', {
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
                const hashes = extractHashes(result?.data);
                setHashes(hashes);

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

    const finalData = checkedRemoveUser ? removeUser(data) : data;  

    return ( 
        <>
            <div class="level">
                <MaxResultRow />
                <div class="level-item"><CheckboxHashtag /></div>
                <div class="level-item"><CheckboxRemoveUser /></div>
                <Paging />
            </div>
            <DisplayRows data={finalData} users={users} num_of_rows={num_of_rows} DisplayTweet={DisplayTweet1} checkedHashtag={checkedHashtag} />            
            <DisplayHashes data={hashes} addQuery={addQuery} removeQuery={removeQuery} />
        </>
    )
}


function DisplayHash({label, addQuery = f => f, removeQuery = f => f}) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(false);
    }, [label]);

    function onChange() {
        if (!checked) {
            setChecked(true);
            addQuery(label);
        } else {
            setChecked(false);
            removeQuery(label);
        }
    }

    return (
        <div>
            <label>
                {label}
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
            </label>
        </div>
    )
}

function DisplayHashRow({row, addQuery = f => f, removeQuery = f => f}) {
    return (
        <div class="column">
            {
                row?.map(item => <DisplayHash label={item} addQuery={addQuery} removeQuery={removeQuery} />)
            }
        </div>
    )
}

function DisplayHashes({data, addQuery = f => f, removeQuery = f => f}) {
    if (!data) return;
    
    const num_of_rows = 5;
    const rows = createChunks(data, num_of_rows);

    return (
        <>
        <p> num of hashes = {data.length} </p>
        <div class="columns">
        {
            rows.map( row => <DisplayHashRow row={row} addQuery={addQuery} removeQuery={removeQuery} /> )
        }
        </div>
        </>
    )
}

function removeUser(data) {
    const ids = loadJSON("removeduser");
    if (!ids) return data;
    const filtered = data?.filter(item => !(ids.includes(item.author_id)))
    return filtered;
}


