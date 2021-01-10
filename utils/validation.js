
function validateEmail(email) {
    const emailRegEx = /\S+@\S+\.\S+/;
    return emailRegEx.test(email);

}

function validatePassword(password, confirmPass) {
    if (password === confirmPass && password.length < 16 && password.length > 8) {
        return true;
    }
    return false;

}

function validateName(name) {
    if (typeof (name) === 'string' && name.length < 10 && name.length > 1) {
        return true;
    }
    return false;

}

function validatePhone(num) {
    const phoneNumTemplate = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneNumTemplate.test(num);

}

function validateBio(bio){
    if(bio.length > 0 && bio.length < 100) return true;
    return false;
}
function validateSignup(req) {
    console.log(req.body);
    const { firstName, lastName, email, password, passwordVerif, phoneNumber, bio } = req.body;
    console.log(validateEmail(email), validatePassword(password, passwordVerif) , validateName(firstName) , validateName(lastName) , validatePhone(phoneNumber) , validateBio(bio));
    if (validateEmail(email) && validatePassword(password, passwordVerif) && validateName(firstName) && validateName(lastName) && validatePhone(phoneNumber) && validateBio(bio)) {
        return true;
    }
    return false;
}

module.exports = { validateSignup };