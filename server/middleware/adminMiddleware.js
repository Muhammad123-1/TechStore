export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as admin'
        });
    }
};

export const adminOrAssistant = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'assistant')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized for this action'
        });
    }
};

export const adminAssistantOrDelivery = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'assistant' || req.user.role === 'delivery')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized for this action'
        });
    }
};
