import * as React from 'react'
import {ListGroup, ListGroupItem, Form, FormGroup, Input, Label, Button} from 'reactstrap'


const List:React.FC = () => {
    return (
        <div className='list-container'>
            <Form
                inline
                className='list-container__form'
            >
                <FormGroup
                    floating

                >
                    <Input
                        id="mark"
                        name="mark"
                        placeholder="Mark"
                        type="text"

                    />
                    <Label for="mark">
                        Mark
                    </Label>
                </FormGroup>
            </Form>

            <ListGroup className='list-container__list'>
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map((item) => (
                        <ListGroupItem
                            draggable
                            className='list-container__list-item'
                            key={item}
                        >
                            <span>{`Маркер ${item}`}</span>
                            <Button
                                close
                                className='list-container__list-btn'
                            />
                        </ListGroupItem>
                    ))
                }

            </ListGroup>
        </div>
    )
}

export default List