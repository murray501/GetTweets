import Link from 'next/link';

export default function Index() {
    return (
    <div class="container">
        <section class="section">
            <nav class="panel">
                <p class="panel-heading">
                    search pages
                </p>
                <Item url="/search/advance" title="advanced search" />
                <Item url="/search/space" title="space search" />
                <Item url="/search/users" title="user search" />
                <Item url="/bookmark/users" title="bookmarked users" />
                <Item url="/bookmark/tweets" title="bookmarked tweets" />
                <Item url="/bookmark/history" title="bookmarked search" />
                <Item url="/bookmark/removedusers" title="removed users" />
                <Item url="/bookmark/space" title="bookmarked spaces" />
                <Item url="/bookmark/words" title="bookmarked words" />
            </nav>
        </section>
    </div>
    )
}

function Item({url, title}) {
    return (
        <Link href={url}>
            <a class="panel-block">
                <span class="panel-icon">
                    <i class="fas fa-book" aria-hidden="false"></i>
                </span>
                {title}
            </a>            
        </Link> 
    )
}
