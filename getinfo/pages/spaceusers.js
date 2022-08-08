import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { loadJSON } from '../components';
import { Users } from '../components/users';

export default function SpaceUsers() {
    const router = useRouter();
    const {type, itemid} = router.query;

    return (
        <>
        <div>type: {type} itemid: {itemid}</div>
        <Users storagename="spaceusers" />
        </>
    )
}