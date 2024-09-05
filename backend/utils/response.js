// utils/response.js

/**
 * Sends a standardized JSON response.
 * 
 * @param {Object} res - Express response object.
 * @param {Number} statusCode - HTTP status code.
 * @param {Boolean} success - Indicates if the operation was successful.
 * @param {String} message - Response message.
 * @param {Object} data - (Optional) Data to include in the response.
 * @param {Object} errors - (Optional) Errors to include in the response.
 */
 const sendResponse = (res, statusCode, success, message, data = null, errors = null) => {
    const response = {
        success,
        message,
    };

    if (data) {
        response.data = data;
    }

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

export default sendResponse;
