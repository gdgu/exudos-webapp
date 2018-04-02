class User {
    static userTypes() {
        return ['student', 'faculty'];
    }
    constructor(username, password, type, link) {
        if(typeof user !== 'string') throw new TypeError(`first argument username must be of type string, ${typeof name} found`);
        if(!User.userTypes().includes(type)) throw new TypeError(`cannot find specified user type ${type} in third argument. Must be ${User.userTypes().join(' or ')}.`);

        this.type = type;
        this[this.type] = link;

        this.username = username;
        this.password = password;
    }
}

module.exports = User;