import React, { Component } from 'react'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import NewItemForm from './NewItemForm';


export default class User extends Component {
    state = {
        user: {},
        bucketList: [],
        updateUser: false,
        redirect: false,
    }

    getUser = async () => {
        const userId = this.props.match.params.userId
        const response = await axios(`/api/users/${userId}`)
        this.setState({
            user: response.data,
            bucketList: response.data.bucketList
        })
    }

    componentDidMount = () => {
        this.getUser()
    }

    handleDelete = async () => {
        const userId = this.props.match.params.userId
        await axios.delete(`/api/users/${userId}`)
        this.setState({ redirect: true })
    }

    handleChange = (event) => {
        const updatedUser = { ...this.state.user }
        updatedUser[event.target.name] = event.target.value
        this.setState({ user: updatedUser })
    }

    handleUpdate = async (event) => {
        const userId = this.props.match.params.userId
        const updatedUser = this.state.user
        await axios.put(`/api/users/${userId}`, updatedUser)
    }

    toggleUpdateUser = () => {
        this.setState({ updatedUser: !this.state.updateUser })
    }

    addNewItem = async (newItem) => {
        const userId = this.props.match.params.userId
        await axios.post(`/api/users/${userId}/items`, newItem)
        await this.getUser()
    }

    handleDeleteItem = async (itemId) => {
        const userId = this.props.match.params.userId
        await axios.delete(`/api/users/${userId}/items/${itemId}`)
        await this.getUser()
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/users' />
        }
        const bucketList = this.state.bucketList.map((item, i) => {
            return (
                <div key={i}>
                    <input type='checkbox'></input>{item.description}
                    <button onClick={() => this.handleDeleteItem(item._id)}>X</button>
                    
                </div>

            )
        })
        const editUserForm = (
            <form onSubmit={this.handleUpdate}>
                <input type='text' name='name' onChange={this.handleChange} value={this.state.user.name} />
                <input type='submit' value='Update' />
            </form>
        )

        return (
            <div>
                <h1>{this.state.user.name}'s Bucket List <button onClick={() => this.toggleUpdateUser()}>Edit User</button>
                <button onClick={() => this.handleDelete()}>Delete User</button>

                </h1>

                {this.state.updatedUser ? editUserForm : ''}

                <NewItemForm
                    addNewItem={this.addNewItem}
                    getUser={this.getUser}
                />

                <div>
                {bucketList}
                </div>
                <Link to='/users' >Back to All Users</Link>

            </div>
        )
    }
}
