import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import NewItemForm from './NewItemForm';
import styled from 'styled-components'


const StyledUserPage = styled.div`
background-color: #ffe066;
background-image: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
height: 100vh;
font-family: 'Reenie Beanie', cursive;
nav{
    display:flex;
    padding-top:20px;
    justify-content:space-around;
    text-align:center;
    font-size:30px;
}
a{
    color:#247ba0;
}
a:hover{
    color: #70c1b3;
}
h1{
    text-align:center;
    font-size:80px;
    margin:30px 0 30px 0;
    color:#f25f5c;
}
button{
    background-color:#70c1b3;
    color:#247ba0;
    font-weight:bold;
    font-family: 'Reenie Beanie', cursive;
    font-size:30px;
}
button:hover{
    background-color:#50514f;
}
.delete:hover{
background-color:#f25f5c;
}
.edit-delete{
display:flex;
justify-content:space-around;
padding-bottom:20px;
}
`

const StyledEditUserForm = styled.div`
text-align:center;
font-family: 'Reenie Beanie', cursive;
font-size:35px;
font-weight:bold;
color:#f25f5c;
margin-top: 20px;
margin-bottom:50px;
input{
    font-family: 'Reenie Beanie', cursive;
    font-size:30px;
    color:#247ba0;
    font-weight:bold;
    background-color:#70c1b3;
}
.update{
    background-color:#70c1b3
}
.update:hover{
    background-color:#50514f;
}
`

const StyledBucketList=styled.div`
display:flex;
justify-content:space-around;
position:relative;
 div{
    font-size:45px;
    font-family: 'Reenie Beanie', cursive;
    font-weight:bold;
    color:#f25f5c;
}
input[type=checkbox]{
    transform: scale(2.0);
}
input[type=checkbox]:checked{
    text-decoration: line-through;
}
`
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
                <StyledBucketList key={i}>
                    <input type='checkbox'></input>
                    <div>{item.description}</div>
                    <button className='delete' onClick={() => this.handleDeleteItem(item._id)}>X</button>
                </StyledBucketList>

            )
        })
        const editUserForm = (
            <StyledEditUserForm>
                <form onSubmit={this.handleUpdate}>
                    <input type='text' name='name' onChange={this.handleChange} value={this.state.user.name} />
                    <input className='update' type='submit' value='Update' />
                </form>
            </StyledEditUserForm>
        )

        return (
            <StyledUserPage>
                <nav>
                    <a href='/'><i className='fa fa-home'></i></a>
                    <a href='/users'><i className='fa fa-users' ></i></a>
                </nav>
                <h1>{this.state.user.name}'s Bucket List</h1>
                <div className='edit-delete'>
                    <span>
                        <button onClick={() => this.toggleUpdateUser()}>Edit User</button> {this.state.updatedUser ? editUserForm : ''}
                    </span>
                    <button className='delete' onClick={() => this.handleDelete()}>Delete User</button>
                </div>
                <StyledEditUserForm>
                    <NewItemForm
                        addNewItem={this.addNewItem}
                        getUser={this.getUser}
                    />
                </StyledEditUserForm>

                <div className='bucket-list'>
                    {bucketList}
                </div>
            </StyledUserPage>
        )
    }
}
