class Message{
    constructor(chat,user,content,dateTime){
        if(typeof content !== 'string') throw new TypeError(`third argument content must be of type string, ${typeof content} found`);    
        if(dateTime instanceof Date) throw new TypeError(`fourth argument dateTime must be an instance of Date`);    

        this.chat= chat;
        this.user= user;
        this.content= content;
        this.dateTime= dateTime;
    }
}
module.exports =Message;