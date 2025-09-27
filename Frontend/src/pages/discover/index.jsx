import { getAllUsers } from '@/config/redux/actions/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function DicoverPage() {

    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!authState.allProfileFetched) {
            dispatch(getAllUsers());

        }
    }, [])


    return (
        <UserLayout>
            <DashBoardLayout>
                <h1>Discover</h1>
            </DashBoardLayout>
        </UserLayout>
    )
}

export default DicoverPage