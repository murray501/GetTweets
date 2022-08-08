import { BookmarkTweet } from "../../components/bookmark_tweet";
import { DisplayTweet1 } from "../../components";

export default function Bookmarks() {
    return (
        <BookmarkTweet fetchurl="/lookup_tweets" storage="bookmark" displaytweet={DisplayTweet1} />
    )
}

