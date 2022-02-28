const socket = io()

//elements
 const $messageform=document.querySelector('#msgform')
 const $messageInput=document.querySelector('#msgString');
 const $messageButton=document.querySelector('button')
 const $messages=document.querySelector('#messages')
 

 //Templates
 const messageTemplate= document.querySelector('#message-template').innerHTML
 const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
 const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

 //Options
 const {username, room } = Qs.parse(location.search, {  ignoreQueryPrefix : true})

 const autoscroll = () =>{

    //New Message element
    const $newMessage = $messages.lastElementChild

    // Height of the new  message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of message container
    const containerHeight = $messages.scrollHeight

    //How far I have scrolled

    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

 }

 $messageform.addEventListener('submit',(e)=>{
    e.preventDefault();
    messageString=$messageInput.value;
    socket.emit('message',messageString , (acknoledgement)=>{
        $messageInput.value='';
        $messageInput.focus()
        console.log(acknoledgement)
    })
})

socket.on('message' , (msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate, {

        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.genearatedAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

    autoscroll()
})

socket.on('locationMessage',(msg)=>{

    const html = Mustache.render(locationMessageTemplate, {
        username:msg.username,
        urlLink:msg.url,
        generatedAt:moment(msg.generatedAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ( { room , users})=>{
    const html = Mustache.render(sidebarTemplate , {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#send-location').addEventListener('click' , ()=>{
    
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const positionobj = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }

        socket.emit('sendLocation',positionobj, (acknoledgement)=>{
            console.log(acknoledgement)
        })

    })
})

socket.emit('join', {username,room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})