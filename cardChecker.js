class CardChecker {
    constructor(message, numberStore) {
        this._message = message;
        this._numberStore = numberStore;
    }

    checkForCardNumbers(checked) {
        let result = '';
        for (let r in this._numberStore) {
            let value = this._numberStore[r];
            if(value.test(checked)) result = r;
        }
        if (result === '') return 'Clean';
        return result; 
    }

    createStringToCheck() {
        const parsed = this._message.toString();
        const msgArr = parsed.split('\n');
        const last = msgArr[msgArr.length-1];
        //console.log(msgArr);
        const toJ = JSON.parse(last);
        const stringToCheck = toJ.message.toString();
        return stringToCheck;
    }
}

module.exports = CardChecker;