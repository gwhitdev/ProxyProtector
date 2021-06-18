class ServerTestCheck {
    constructor(message) {
        this._message = message;
    }

    checkForServerTest() {
        const parsed = this._message.toString();
        const msgArr = parsed.split('\n');
        //console.log(msgArr);
        const reqType = msgArr[0].split('/');
        let get = reqType[0].trim();
        if(get === 'GET') return true;
        return false;
    }
}

module.exports = ServerTestCheck;