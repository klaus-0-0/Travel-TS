import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    userId?: string;
}
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=VerifyAdmin.d.ts.map