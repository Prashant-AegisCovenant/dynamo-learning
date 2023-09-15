export const isValidString = (value) => typeof value === 'string' && value.trim() !== '';

export const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);

export const requiredAttributes = [
    'product_name',
    'product_category',
    'price',
    'stock_in_warehouse',
];

export const isValidProduct = (product) => {
    for (const attribute of requiredAttributes) {
        if(!product[attribute]) {
            // console.log(`Invalid Attribute: ${attribute}`)
            return false;
        }
    }

    if(!isValidString(product.product_name) || !isValidString(product.product_category)) {
        // console.log('Invalid string attribute')
        return false;
    }

    if(!isValidNumber(product.price) || !isValidNumber(product.stock_in_warehouse) || (product.stock_in_shop !== undefined && !isValidNumber(product.stock_in_shop))) {
        // console.log('Invalid numeric attribute')
        return false;
    }

    return true;
}
