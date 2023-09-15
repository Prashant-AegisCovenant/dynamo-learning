import { db } from "./app.mjs";

export const handler = async (event, context) => {
try {
    const {productId} = event.pathParameters

    if (!productId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Product ID is missing' }),
        };
    }
  
    const params = {
      TableName: 'Products',
      Key: {
        id: productId
      }
    };

    const result = await db.get(params).promise();

    if(result.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    }
    return {
        statusCode: 200,
        body: `Item not found for productId: ${productId}`
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
