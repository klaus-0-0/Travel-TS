"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Auth_1 = __importDefault(require("./Auth"));
const AdminData_1 = __importDefault(require("../admin/AdminData"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api", Auth_1.default);
app.use("/api", AdminData_1.default);
app.get("/", (req, res) => {
    console.log("success");
    res.status(200).json({ message: "success" });
});
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map