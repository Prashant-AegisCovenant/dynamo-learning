import { db } from "./app.mjs";
import {v4 as uuidv4} from 'uuid';
import { isValidProduct, requiredAttributes } from "./helpers/index.js";

const generateUniqueID = () => {
    return uuidv4();
}

export const handler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!isValidProduct(requestBody)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid product data', body: requestBody, requiredAttributes }),
      };
    }

    const productId = generateUniqueID();
    const currentTime = new Date().toISOString();

    const params = {
      TableName: 'Products',
      Item: {
        id: productId,
        product_name: requestBody.product_name,
        product_category: requestBody.product_category,
        price: requestBody.price,
        stock_in_warehouse: requestBody.stock_in_warehouse,
        stock_in_shop: requestBody.stock_in_shop,
        last_updated: currentTime,
      },
    };

    await db.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Product created successfully', productId }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error }),
    };
  }
};