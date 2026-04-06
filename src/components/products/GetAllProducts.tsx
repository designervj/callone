"use client"

import GetAllTravisMethew from "./travismethew/GetAllTravisMethew"
import GetAllBrands from "../brands/GetAllBrands"
import GetAllAtributeSet from "../attributeSet/GetAllAtributeSet"
import GetAllOgio from "./Ogio/GetAllOgio"
import GetAllHardGood from "./HardGood/GetAllHardGood"
import GetAllRoleBasedUser from "../auth/GetAllRoleBasedUser"


const GetAllProducts = () => {
   
    return (
        <>
        <GetAllAtributeSet/>
        <GetAllBrands/>
        <GetAllTravisMethew/>
        <GetAllOgio/>
        <GetAllHardGood/>
        <GetAllRoleBasedUser/>
        </>
    )
}

export default GetAllProducts