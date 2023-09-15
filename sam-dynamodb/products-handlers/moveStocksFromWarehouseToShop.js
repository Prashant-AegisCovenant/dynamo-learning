import { db } from "./app.mjs";

export const handler = async (event, context) => {
    try{
        const {productId, stocksToMoveWS} = event.pathParameters

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

        const stocksToMove = parseInt(stocksToMoveWS);
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

        if(result.Item.stock_in_warehouse < stocksToMove) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Not enough stocks in warehouse' })
            }
        }

        const updateParams = {
            TableName: 'Products',
            Key: {
                id: productId,
            },
            UpdateExpression: 'SET stock_in_warehouse = stock_in_warehouse - :move',
            ExpressionAttributeValues: {
                ':move': stocksToMove
            }
        }
        
        if (result.Item.hasOwnProperty('stock_in_shop')) {
            updateParams.UpdateExpression += ', stock_in_shop = stock_in_shop + :move';
        } else {
            updateParams.UpdateExpression += ', stock_in_shop = :move';
            updateParams.ExpressionAttributeValues[':move'] = stocksToMove;
        }

        await db.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Stocks moved successfully from warehouse to shop'})    
        }
    } catch (error) {
        console.error('Error in moving stocks from warehouse to shop:', error);
        return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
}