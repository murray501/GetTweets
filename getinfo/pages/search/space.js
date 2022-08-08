import 'isomorphic-fetch';
import {useState} from "react";
import {SearchForm} from "../../components";
import { SpaceResult } from '../../components/space';

export default function SearchSpace() {
    const [query, setQuery] = useState();

    return (
        <section class="hero is-size-7">
            <div class="hero-body">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <SearchForm onNewSearch={setQuery} />    
                        </div>
                    </div>
                    <div class="level-right">query:{query}</div>
                </div>
                <SpaceResult query={query} />
            </div>
        </section>
    )
}

