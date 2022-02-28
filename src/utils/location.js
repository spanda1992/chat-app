const generateLocationMessage= (username, latitude,longitude) =>{
    return locationMessage = {
        username,
        url : 'https://google.com/maps?q='+latitude+','+longitude,
        generatedAt: new Date().getTime()
    }
}

module.exports = {
    generateLocationMessage
}