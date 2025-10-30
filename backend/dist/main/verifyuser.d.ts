import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}
declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=VerifyUser.d.ts.map