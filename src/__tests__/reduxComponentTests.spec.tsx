import * as React from 'react'
import { render, fireEvent, screen } from '../utils'
import { waitFor } from '@testing-library/react';
import List from '../components/List'

test('render list, adding and deleting list items', async () => {
    render(<List/>)
    expect(screen.getByPlaceholderText(/Mark/i)).toBeInTheDocument()
    expect(document.getElementsByTagName('li').length).toBeGreaterThanOrEqual(1)
    expect(document.querySelectorAll('ul').length).toBeGreaterThanOrEqual(1)

    const input = screen.getByPlaceholderText(/Mark/i)
    fireEvent.change(input, {target: { value: 'Mark1', qwe: '123'}})
    fireEvent.submit(input)

   await waitFor(() => {
       expect(screen.getByText(/Mark1/i)).toBeInTheDocument()
   })

   const button = screen.getByRole('button')
   fireEvent.click(button)

    await waitFor(() => {
        expect(button).not.toBeInTheDocument()
    })

})