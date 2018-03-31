class Message{
    constructor(chat,user,content,dateTime){
        this.chat= chat;
        this.user= user;
        this.content= content;
        this.dateTime= dateTime;
    }
}
module.exports =Message;