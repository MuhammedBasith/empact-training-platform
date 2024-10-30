import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ success: false, message: err.message });
};

export default errorHandler;
