class Document{
    constructor(content,encoding,mimeType){
        if(typeof encoding !== 'string') throw new TypeError(`second argument encoding must be of type string, ${typeof encoding} found`);
        if(typeof mimeType !== 'string') throw new TypeError(`third argument mimeType must be of type string, ${typeof mimeType} found`);
                
        this.content= content;
        this.encoding= encoding;
        this.mimeText= mimeType;
    }
}
module.exports =Document;
