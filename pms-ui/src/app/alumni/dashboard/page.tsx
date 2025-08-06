import React from 'react'
import NavButton from '../../components/navigation/NavButton'
import NoticeBoard from "@/components/NoticeBoard";

const Dashboard = () => {
  return (
    <>

    <NavButton />
    <NoticeBoard userRole="alumni" />
    </>
  )
}

export default Dashboard