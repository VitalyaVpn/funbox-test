import * as React from 'react'
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {ListGroup, ListGroupItem, Form, FormGroup, Input, Label, Button} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import {IMarker, mapSlice} from '../store/reducers/MapSlice'
import {useFormik } from 'formik'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'

// @ts-ignore
const SortableItem = SortableElement(({name, close, className, onClick, btnClass}) =>
    <ListGroupItem
        className={className}
    >
        <span className='list-container__list-text'>{name}</span>
        <Button
            className={btnClass}
            close = {close}
            onClick={onClick}
        />
    </ListGroupItem>)

// @ts-ignore
const SortableCont = SortableContainer(({children}) => {
    return <ListGroup className='list-container__list'>{children}</ListGroup>;
})

const List:React.FC = () => {
    const formik = useFormik({
        initialValues: {
            mark: ''
        },
        onSubmit: values => {
            if (values.mark) {
                dispatch(addMarker({
                    name: values.mark,
                    position: center,
                    id: markers.length
                }))
                dispatch(setRoutes())
                values.mark = ''
            }
        }
    })
    const dispatch = useAppDispatch()
    const {markers, center} = useAppSelector(state => state.mapReducer)
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const {addMarker, setRoutes, clearMarkers, deleteMarker, dragList} = mapSlice.actions
    // React.useEffect(()=> {
    //     dispatch(clearMarkers())
    // }, [])
    const handleDelete = (id: number) => {
        dispatch(deleteMarker(id))
    }

    //@ts-ignore
    const onSortEnd = ({oldIndex, newIndex}) => {
        const draggedMarkers:Array<IMarker> = [...arrayMove(markers, oldIndex, newIndex)]
        dispatch(dragList(draggedMarkers))
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

            <SortableCont
                onSortEnd={onSortEnd}
                pressDelay = {isMobile ? 200 : 0}
            >
                {
                    markers[0] ? markers.map((item, index) => (
                        // <ListGroupItem
                        //     draggable
                        //     className='list-container__list-item'
                        //     key={item.id}
                        // >
                        //     <span>{item.name}</span>
                        //     <Button
                        //         close
                        //         className='list-container__list-btn'
                        //         onClick={()=>{handleDelete(item.id)}}
                        //     />
                        // </ListGroupItem>
                        <SortableItem
                            key={index}
                            index={index}
                            name={`${item.id + 1}. ${item.name}`}
                            close={true}
                            className='list-container__list-item'
                            onClick={()=>{handleDelete(item.id)}}
                            btnClass='list-container__list-btn'
                        />
                    ))
                        :
                        <ListGroupItem>

                        </ListGroupItem>

                }

            </SortableCont>
        </div>
    )
}

export default List