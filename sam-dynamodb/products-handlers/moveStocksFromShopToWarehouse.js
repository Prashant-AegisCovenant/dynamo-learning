import { db } from "./app.mjs";

export const handler = async (event, context) => {
    try{
        const {productId, stocksToMoveSW} = event.pathParameters

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

        const stocksToMove = parseInt(stocksToMoveSW);
        if(isNaN(stocksToMove) || stocksToMove <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid stocks to move value' })
            }
        }
        
        const result = await db.get(params).promise();

        if(!result.Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Product not found'})
            }
        }

        if(!result.Item.hasOwnProperty('stock_in_shop')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No stock exists in shop for this product' })
            }
        }

        if(result.Item.stock_in_shop < stocksToMove) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Not enough stocks in shop' })
            }
        }

        const currentTime = new Date().toISOString();
        
        const updateParams = {
            TableName: 'Products',
            Key: {
                id: productId,
            },
            UpdateExpression: 'SET stock_in_warehouse = stock_in_warehouse + :move, stock_in_shop = stock_in_shop - :move, last_updated = :currentTime',
            ExpressionAttributeValues: {
                ':move': stocksToMove,
                ':currentTime': currentTime,
            }
        }

        await db.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Stocks moved successfully from shop to warehouse'})    
        }
    } catch (error) {
        console.error('Error in moving stocks from shop to warehouse:', error);
        return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
}