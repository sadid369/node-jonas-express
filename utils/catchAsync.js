const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
// const catchAsync = (fn) => (req, res, next) => {
//     Promise
//         .resolve(fn(req, res, next))
//         .catch((err) => next(err));
// };

// const catchAsync = (requestHandler) => {
//     return async (req, res, next) => {
//         try {
//             await requestHandler(req, res, next);
//         } catch (err) {
//             next(err);
//         }
//     };
// };
// const catchAsync = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//     };
// };

module.exports = catchAsync;