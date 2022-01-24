import * as React from 'react'
import List from '../../components/List'
import './index.scss'
import MapWrapper from "../../components/Map";



const Main: React.FC = () => {



    return (
        <div className='main'>
            <List />
            <MapWrapper />
        </div>
    )
}

export default Main