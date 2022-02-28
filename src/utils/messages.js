const generateMessage = (username,text)=>{
    return message = {
        username,
        text,
        genearatedAt:new Date().getTime()
    }
}

module.exports= {
    generateMessage
}