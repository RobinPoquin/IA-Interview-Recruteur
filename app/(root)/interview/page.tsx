import React from 'react'
import Agent from "@/components/Agent";

const Page = () => {
    return (
        <>
            <h3>Interview Génération</h3>

            <Agent userName={"Vous"} userId={"user1"} type={"generate"} />
        </>
    )
}
export default Page
