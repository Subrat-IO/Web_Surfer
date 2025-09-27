import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'



function MyConnectionPage() {
    return (
        <UserLayout>
            <DashBoardLayout>
               <h1>My Connection</h1>
            </DashBoardLayout>
        </UserLayout>
    )
}

export default MyConnectionPage