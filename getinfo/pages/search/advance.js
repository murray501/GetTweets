import {QueryResult} from "../../components/query";
import {Query} from "../../components/advance";

export default function advance() {
    return (
        <Query renderResult={(query, addQuery, removeQuery) => 
            <QueryResult query={query} addQuery={addQuery} removeQuery={removeQuery} />} />
    )
}
