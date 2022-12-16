const Validator = require('validatorjs');

const amounts = [5,10,20,50,100], roles = ["VENDOR","USER"];
Validator.register('amount', value => amounts.includes(parseInt(value)),'The amount field must be 5, 10, 20, 50 and 100.');
Validator.register('role', value => roles.includes(value.toUpperCase()),'The role field must be vendor or user.');
Validator.register('space_not', value => (/\s/g).test(value.toString()) ? false : true, "The field doesn't contains spaces.");
Validator.register('min_quantity', value => parseInt(value) > 0, 'The quantity at least be 1')
const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;