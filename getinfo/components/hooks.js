import { useState, useReducer } from "react";
import { loadJSON, saveJSON, DefineRows, DefineRows2} from "./index.js";

export function set_num_of_rows(init_num_of_rows) {
  const [num_of_rows, setNumOfRows] = useState(init_num_of_rows);
  
  function onNewDefine(num_of_rows_value) {
    setNumOfRows(parseInt(num_of_rows_value));
  }

  return [
    () => 
    <div class="level-left">
      <div class="level-item">
        <DefineRows2 onNewDefine={onNewDefine} />
      </div>
      <div class="level-item">num_of_rows: {num_of_rows}</div>
    </div>,
    num_of_rows
  ]
}

export function maxresult_row(init_max_results, init_num_of_rows) {
  const [max_results, setMaxResults] = useState(init_max_results);
  const [num_of_rows, setNumOfRows] = useState(init_num_of_rows);

  function onNewDefine(max_results_value,num_of_rows_value) {
    setMaxResults(parseInt(max_results_value));
    setNumOfRows(parseInt(num_of_rows_value));
  }

  return [
    () => 
    <div class="level-left">
      <div class="level-item">
        <DefineRows onNewDefine={onNewDefine} />
      </div>
      <div class="level-item">max_results: {max_results}</div>
      <div class="level-item">num_of_rows: {num_of_rows}</div>
    </div>,
    max_results,
    num_of_rows
  ]
}

export function RemovePerson({userid}) {  
  function add() {
    const previous = loadJSON('removeduser');
    if (previous?.includes(userid)) return;
    previous?.unshift(userid);
    saveJSON('removeduser', previous ? previous : [userid]);
  }

  return (
    <div class="level-item">
        <a onClick={add}><span class="icon"><i class="fas fa-solid fa-person-burst"></i></span></a> 
    </div>
  )
}

export function AddPerson({userid}) {  
  function add() {
    const previous = loadJSON('follow');
    if (previous?.includes(userid)) return;
    previous?.unshift(userid);
    saveJSON('follow', previous ? previous : [userid]);
  }

  return (
    <div class="level-item">
        <a onClick={add}><span class="icon"><i class="fas fa-solid fa-person"></i></span></a> 
    </div>
  )
}

function BookmarkBasic({id, storage}) {
  const [bookmarked, setBookmarked] = useState(isBookmarked());
  
  function isBookmarked() {
    const previous = loadJSON(storage);
    return previous?.includes(id);
  }

  function add() {
    const previous = loadJSON(storage);
    previous?.unshift(id);
    saveJSON(storage, previous ? previous : [id]);
    setBookmarked(true);
  }

  function remove() {
    const previous = loadJSON(storage);
    const current = previous?.filter(x => x !== id);
    saveJSON(storage, current);
    setBookmarked(false);
  }

  return (
    <div class="level-item">
    {
      bookmarked ? 
        <a onClick={remove}><span class="icon"><i class="fas fa-solid fa-trash"></i></span></a> :
        <a onClick={add}><span class="icon"><i class="fas fa-solid fa-bookmark"></i></span></a> 
    }
    </div>
  )
}

export function Bookmark({id}) {
  return (
    <BookmarkBasic id={id} storage="bookmark" />
  )
}

export function BookmarkSpace({id}) {
  return (
    <BookmarkBasic id={id} storage="bookmarkspace" />
  )
}

export function follow_unfollow(id) {
  const [followStatus, setFollowStatus] = useState(follow_status());
  
  function follow_status() {
    const previous = loadJSON('follow');
    return previous?.includes(id);
  }

  function follow() {
    const previous = loadJSON('follow');
    previous?.unshift(id);
    saveJSON('follow', previous ? previous : [id]);
    setFollowStatus(true);
    
  }

  function unfollow() {
    const previous = loadJSON('follow');
    const current = previous?.filter(x => x !== id);
    saveJSON('follow', current);
    setFollowStatus(false);
  }

  return [() =>
    <div class="level-item">
    { followStatus ? 
        <button class="button is-small" onClick={unfollow}>unfollow </button> : 
        <button class="button is-small" onClick={follow}>follow </button>                                                        
    }
    </div>
  ]
}

export function half_paging(onClickStart = f => f, onClickNext = f => f) {
  const [nextToken, setNextToken] = useState();
  const [count, setCount] = useState(0);
  
  return [
    () =>
    <div class="level-right">
      <div class="level-item">count: {count}</div>
       
          <button class="button level-item is-small" onClick={onClickStart} >Start</button>
      
      { nextToken ?
          <button class="button level-item is-small" onClick={onClickNext} >Next</button> : <></>
      }
    </div>,
    nextToken,setNextToken,
    count,setCount]
}

export function paging(onClickStart = f => f, onClickPrev = f => f, onClickNext = f => f) {
  const [nextToken, setNextToken] = useState();
  const [previousToken, setPreviousToken] = useState();
  const [count, setCount] = useState(0);

  return [
    () =>
    <div class="level-right">
      <div class="level-item">count: {count}</div>
      
      <button class="button level-item is-small" onClick={onClickStart} >Start</button>
      
      { previousToken ?
          <button class="button level-item is-small" onClick={onClickPrev} >Previous</button> : <></>
      }
      { nextToken ?
          <button class="button level-item is-small" onClick={onClickNext} >Next</button> : <></>
      }
    </div>,
    nextToken,setNextToken,
    previousToken,setPreviousToken,
    count,setCount,
    ]
}

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: e => setValue(e.target.value) },
    () => setValue(initialValue)
  ];
};

export const useInput2 = () => {
  const [value, setValue] = useState();
  return [
    { value, onChange: e => setValue(e.target.value) },
    (val) => setValue(val)
  ];
};

export function Checkbox(label, init_value=false) {
  const [checked, setChecked] = useReducer(
    checked => !checked,
    init_value
  );

  return [
      () => 
      <>
          <label>
          {label}
          <input
              type="checkbox"
              checked={checked}
              onChange={setChecked}
          />
          </label>
      </>,
      checked
  ];
}