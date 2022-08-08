import {useState} from "react";
import {loadJSON, saveJSON, createChunks} from "../../components";

function ShowWord({word, remove = f => f}) {
    return (
        <div class="level">
            <div class="level-left">
                <p class="level-item">{word}</p>
            </div>
            <div class="level-right">
                <button class="level-item delete is-small" onClick={() => remove(word)}></button>
            </div>
        </div>
    )
}

export default function ShowWords() {
    const num_of_rows = 10;
    const [queries, setQueries] = useState(loadJSON('words'));
    
    function remove(query) {
        const removed = queries?.filter(x => x !== query);
        saveJSON('words', removed);
        setQueries(removed);
    }
    
    const rows = createChunks(queries, num_of_rows);

    return (
        <div class="container">
            <section class="section">
                <div class="columns">
                {
                    rows.map(row => 
                        <div class="column">
                            {row.map(word => <ShowWord word={word} remove={remove} />)}
                        </div>    
                    )
                }
                </div>
            </section>
        </div>
    )

}


