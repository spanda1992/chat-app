
const users = []

const addUser = ({ id, username , room})=>{
    //username = username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data

    if(!username || !room){
        return {
            error : 'Username and room are required'
        }
    }

    // check for existing user

    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error : 'Username is in use'
        }
    }

    //store user
    const user = { id , username , room}
    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    const user = users.find((user)=>{
        return user.id === id
    })

    if(!user){
        return {
            error:'No User found'
        }
    }

    return user
}

const getUsersInRoom = (room) =>{

    const usersInRoom = users.filter((user) => {
        return user.room === room
    })

    return usersInRoom
}


// addUser({
//     id:29,
//     username:'Sid',
//     room:'igit'

// })
// addUser({
//     id:31,
//     username:'ksh',
//     room:'igit'

// })

// console.log(addUser({
//     id:30,
//     username:'Sid_2',
//     room:'igit'

// }))

// console.log('removing')
// console.log(removeUser(30))
module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}
