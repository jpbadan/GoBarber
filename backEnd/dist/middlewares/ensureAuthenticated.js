"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("../config/auth"));
function ensureAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new Error('JWT is missing!');
    }
    // Token: Bearer hjfdskhfjksghhg2432hgj324ghj
    var _a = authHeader.split(' '), token = _a[1];
    try {
        var decoded = jsonwebtoken_1.verify(token, auth_1.default.jwt.secret);
        // <as> Quando precisar forçar o tipo de uma var podemos usar esse hack to TS:
        var sub = decoded.sub;
        // Disponibilizamos o id do usuarios nas props da rota:
        request.user = {
            id: sub,
        };
        return next();
    }
    catch (_b) {
        // Customizamos o nosso erro. Para n ficarmos com o erro default da verify()
        throw new Error('Invalid JWT Token');
    }
}
exports.default = ensureAuthenticated;
