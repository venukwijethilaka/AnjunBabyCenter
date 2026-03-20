"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagekit_controller_1 = require("../controllers/imagekit.controller");
const router = (0, express_1.Router)();
router.get("/auth", imagekit_controller_1.getAuthParams);
exports.default = router;
//# sourceMappingURL=imagekit.route.js.map