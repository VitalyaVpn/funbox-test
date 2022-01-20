import * as React from 'react'

const List:React.FC = () => {
    return (
        <div className='list-container'>
            <ul className='list-container__list'>
                <li className='list-container__list-item'>
                    Текст
                </li>
                <li className='list-container__list-item'>
                    Текст
                </li>
                <li className='list-container__list-item'>
                    Текст
                </li>
            </ul>
        </div>
    )
}

export default List