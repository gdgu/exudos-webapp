class Administrator{
    constructor(name,user,rights){
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);        
        
        this.name= name;
        this.user= user;
        this.rights= rights;
    }
}
module.exports =Administrator;
