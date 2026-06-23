const AsyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next))
            .catch((error) => next(error));
    };
};

export { AsyncHandler };
