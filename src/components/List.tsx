import * as React from 'react'
import {ListGroup, ListGroupItem, Form, FormGroup, Input, Label, Button} from 'reactstrap'
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {mapSlice} from '../store/reducers/MapSlice'
import {useFormik } from 'formik'


const List:React.FC = () => {
    const formik = useFormik({
        initialValues: {
            mark: ''
        },
        onSubmit: values => {
            dispatch(addMarker({
                name: values.mark,
                position: center,
                id: markers.length
            }))
            dispatch(setRoutes())
        }
    })
    const dispatch = useAppDispatch()
    const {markers, center} = useAppSelector(state => state.mapReducer)
    const {addMarker, setRoutes, clearMarkers, deleteMarker} = mapSlice.actions
    // React.useEffect(()=> {
    //     dispatch(clearMarkers())
    // }, [])
    const handleDelete = (id: number) => {
        dispatch(deleteMarker(id))
    }

    return (
        <div className='list-container'>
            <Form
                inline
                className='list-container__form'
                onSubmit={formik.handleSubmit}
            >
                <FormGroup
                    floating
                >
                    <Input
                        id="mark"
                        name="mark"
                        placeholder="Mark"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.mark}

                    />
                    <Label for="mark">
                        Mark
                    </Label>
                </FormGroup>
            </Form>

            <ListGroup className='list-container__list'>
                {
                    markers[0] ? markers.map((item, index) => (
                        <ListGroupItem
                            draggable
                            className='list-container__list-item'
                            key={item.id}
                        >
                            <span>{item.name}</span>
                            <Button
                                close
                                className='list-container__list-btn'
                                onClick={()=>{handleDelete(item.id)}}
                            />
                        </ListGroupItem>
                    ))
                        :
                        <ListGroupItem>

                        </ListGroupItem>

                }

            </ListGroup>
        </div>
    )
}

export default List