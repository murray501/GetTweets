import { Following } from '../../components/following';

export default function Index() {
    return <Following fetchcmd="/retweeted_by" />
}