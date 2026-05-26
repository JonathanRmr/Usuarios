class CustomError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
    }

    class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
    }

    class NotFoundError extends CustomError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
    }

    class AuthenticationError extends CustomError {
    constructor(message = 'No autenticado') {
        super(message, 401);
    }
    }

    class AuthorizationError extends CustomError {
    constructor(message = 'No autorizado') {
        super(message, 403);
    }
    }

    class ConflictError extends CustomError {
    constructor(message = 'Conflicto') {
        super(message, 409);
    }
}

module.exports = {
    CustomError,
    ValidationError,
    NotFoundError,
    AuthenticationError,
    AuthorizationError,
    ConflictError,
};