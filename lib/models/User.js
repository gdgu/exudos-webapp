class User {
    static userTypes() {
        return ['student', 'faculty'];
    }
    constructor(username, password, type, link) {
        this.type = type;
        this[this.type] = link;

        this.username = username;
        this.password = password;
    }
}

module.exports = User;