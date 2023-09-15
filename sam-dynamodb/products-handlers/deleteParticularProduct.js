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
        id: productId,
      },
    };

    await db.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({message: `Product with productId: ${productId} deleted successfully`})
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
