import { BookmarkTweet } from "../../components/bookmark_tweet";
import { DisplaySpace } from "../../components";

export default function BookmarkSpace() {
    return (
        <BookmarkTweet fetchurl="/lookup_spaces" storage="bookmarkspace" displaytweet={DisplaySpace} />
    )
}

