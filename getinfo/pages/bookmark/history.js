import {useState} from "react";
import {loadJSON, saveJSON, createChunks} from "../../components";
import {QueryResult} from "../../components/query";
import {useInput} from "../../components/hooks";

export default function History() {
    const [queries, setQueries] = useState(loadJSON("query"));
    const [query, setQuery] = useState();
    const [words, setWords] = useState([]);

    function update(index, title) {
        const updated = [...queries];
        updated[index] = title;
        saveJSON('query', updated);
        setQueries(updated);
    }

    function remove(title) {
        const removed = queries?.filter(x => x !== title);
        saveJSON('query', removed);
        setQueries(removed);
    }
    
    function addWord(word) {
        const newset = new Set([word, ...words]);
        setWords([...newset]);
    }   

    function removeWord(word) {
        const filtered = words?.filter(item => item !== word);
        setWords(filtered);
    }   

    function reset() {
        setWords([]);
    }

    return (
    <div class="container">
        <section class="section">
            <nav class="panel">
                <p class="panel-heading">
                    History
                </p>
                {queries?.map((query, index) =>
                    <Item title={query} index={index} update={update} /> 
                )}
            </nav>
            { query ? 
            <div class="level notification">
                <div class="level-left">
                    <p class="level-item">{query}</p>
                </div>
            </div> : <></>
            }
            <DisplayWords words={words} reset={reset} />
            <QueryResult query={query} addQuery={addWord} removeQuery={removeWord} />
        </section>
    </div>
    )

    function Item({title, index, update= f=>f}) {
        const [isSolid, setIsSolid] = useState(true);
        const [titleProps, resetTitle] = useInput(title);

        if (isSolid) {
            return (
                <div class="panel-block">
                    <a onClick={() => setIsSolid(false)}><span class="icon">
                        <i class="fas fa-solid fa-pencil"></i>
                    </span></a>
                    <a onClick={() => setQuery(title)}>{title}</a>
                    <a onClick={() => remove(title)}><span class="icon">
                        <i class="fas fa-solid fa-trash"></i>
                    </span></a>    
                </div>             
            )
        }

        return (
                <div class="field has-addons">
                    <p class="control is-expanded">
                        <input {...titleProps} class="input" type="text"/>
                    </p>
                    <p class="control">
                        <a class="button is-info" onClick={() => {
                            update(index, titleProps.value)
                            setIsSolid(true)
                        }}>
                            Save
                        </a>
                    </p>
                </div>    
        )
    }
}

function DisplayWords({words, reset = f => f}) {

    if (words.length === 0) return;
    
    function save() {
        const previous = loadJSON('words');
        if (!previous) {
            if (words) {
                saveJSON('words', words);
            }
        } else {
            const current = [...new Set([...words, ...previous])];
            saveJSON('words', current);
        }
        reset();
    }

    const num_of_rows = 10;
    const rows = createChunks(words, num_of_rows);

    return (
        <div class="box">
            <div class="columns">
            {
                rows.map(row => 
                    <div class="column">
                        {
                            row.map(word => 
                                <button class="button is-small">{word}</button>
                            )
                        }
                    </div>    
                )
            }
            </div>
            <button class="button is-small level-item" onClick={save}>Save</button>
        </div>
    )
}
