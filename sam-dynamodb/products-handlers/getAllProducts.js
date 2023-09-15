import { db } from "./app.mjs";

export const handler = async (event, context) => {
  try {
    const params = {
      TableName: 'Products',
    };

    const result = await db.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error retrieving products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
