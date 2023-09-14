/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
import AWS from 'aws-sdk'
const db = new AWS.DynamoDB.DocumentClient({
    region: 'local',
    endpoint: process.env.DYNAMODB_URL
});



export const createItem = async (event, context) => {
    const {id, price} = JSON.parse(event.body);

    const params = {
        TableName: 'test-table',
        Item: {
            id,
            price
        }
    }

    try {
        await db.put(params).promise()
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Item creation successful',
            })
        }
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Item creation failed',
                error: err.message
            })
        };
    }
};

export const getItem = async (event, context) => {
    const {id, price} = event.pathParameters
    const params = {
        TableName: 'test-table',
        Key: {
            id,
            price: parseFloat(price)
        }
    }

    try {
        const data = await db.get(params).promise()
        if(data.Item)
            return {
                'statusCode': 200,
                'body': JSON.stringify(data.Item)
            }
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Item not found!'
            })
        }
    } catch (err) {
        console.log(err)
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Error fetching item',
                error: err.message
            })
        };
    }
}

export const  getAllItems = async (event, context) => {
    const params = {
        TableName: 'test-table',
    }

    try {
        const data = await db.scan(params).promise()
        return {
            'statusCode': 200,
            'body': JSON.stringify(data.Items)
        }
    } catch (err) {
        console.log(err)
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Error fetching items',
                error: err.message
            })
        };
    }
}

export const deleteItem = async (event, context) => {
    const {id, price} = event.pathParameters

    const params = {
        TableName: 'test-table',
        Key: {
            id,
            price: parseFloat(price)
        }
    };

    try {
        await db.delete(params).promise()
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Item deleted successfully'
            })
        }
    } catch (err) {
        console.log(err)
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Error deleting item',
                error: err.message
            })
        }
    }
}