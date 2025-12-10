class ExpressErrors extends Error {
    constructor(status, message) {
        super(message); // ✅ pass message to the Error constructor
        this.status = status;
    }
}

module.exports = ExpressErrors;