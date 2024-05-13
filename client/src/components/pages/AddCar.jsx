import { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../lib/auth.js'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function AddCar({ fetchUserData }) {
    //*Modal variables
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
        clearForm()
    }
    const handleShow = () => {
        setShow(true)
    }

    
    //*Token Variable
    const headers = { headers: { authorization: getToken() } }
    
    //Form Variables
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
    })

    function clearForm() {
        setFormData({ title: '', content: '', image: null })
    }

    //Error Variable
    const [error, setError] = useState('')


    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await axios.post('/api/posts/', formData, headers)
            console.log(res)
            //clear out input fields
            // setFormData({ title: '', content: '', image: null })
            clearForm()
            //close modal
            handleClose()
            //update user posts list
            fetchUserData()

        } catch (error) {
            setError(error.response.data)
            console.log(error.response.data.message)
        }
    }


    return (
        <>
            <Button variant="primary"  className="my-3 px-4 py-2" onClick={handleShow}>Add a Car</Button>
            <Modal show={show} onHide={handleClose} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Post</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Add a title to your post"
                                name='title'
                                onChange={handleChange}
                                value={formData.title}
                                autoFocus
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="content">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='content'
                                onChange={handleChange}
                                value={formData.content}
                                placeholder="Share something about this post "
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        {error && 
                            <p className='text-danger text-center my-2'>{error.message}. Complete all fields.</p>   
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Create Post
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}