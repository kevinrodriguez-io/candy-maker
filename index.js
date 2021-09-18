var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Chance } from "chance";
import images from "images";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import ora from "ora";
var __dirname = path.resolve();
var spinner = ora("Creating JSON Template").start();
var JSON_TEMPLATE = {
    name: "",
    symbol: "",
    image: "0.jpg",
    description: "Someone is coming to the city! Congratulations on getting your ticket to the Metropolis. https://metropolisproject.io",
    seller_fee_basis_points: 1200,
    attributes: [
    // { trait_type: "web", value: "yes", },
    ],
    collection: {
        name: "Metropolis GEN1",
        family: "Metropolis",
    },
    properties: {
        files: [
            {
                uri: "image.jpg",
                type: "image/png",
            },
        ],
        category: "image",
        creators: [
            {
                address: "2dxeRwuUTpCULzCe48sQACRVrhD1aju9VUnFVWTYBU8z",
                share: 100,
            },
        ],
    },
};
spinner.succeed();
spinner.start("Creating layers and weights");
var backgrounds = [
    "baby_pink",
    "city_blue",
    "lemon_cream",
    "mint_icecream",
    "pale_yellow",
];
var background_weights = [20, 20, 20, 20, 20];
// #region Boy stuff
var boy_bodies = ["body_1", "body_2", "body_3", "body_4"];
var boy_body_weights = [25, 25, 25, 25];
var boy_footwear = ["blue", "green", "orange", "red", "white"];
var boy_footwear_weights = [35, 35, 15, 10, 5];
var boy_pants = [
    "black_jeans",
    "black_pants",
    "blue_jeans",
    "brown_cargos",
    "gray_joggers",
    "khaki_pants",
];
var boy_pant_weights = [5, 15, 35, 15, 20, 10];
var boy_hairs = [
    "black_mohawk_beard",
    "long_black",
    "long_brown",
    "long_red",
    "long_white_beard",
    "short_blonde_beard",
    "short_blonde",
];
var boy_hair_weights = [8, 30, 5, 5, 3, 19, 30];
var boy_shirts = [
    "black_shirt",
    "black_solana",
    "brown_shirt",
    "red_shirt",
    "white_shirt",
    "white_tank_top",
];
var boy_shirt_weights = [7, 3, 15, 20, 30, 25];
var boy_accessories = [
    "black_sunglasses",
    "black_eyepatch",
    "glasses",
    "red_hearts",
    "white_sunglasses",
    "none",
];
var boy_accessory_weights = [15, 10, 15, 5, 20, 35];
var boy_sweaters = [
    "black_sweater",
    "black_white_pattern",
    "red_sweater",
    "yellow_sweater",
    "no_sweater",
];
var boy_sweater_weights = [15, 5, 15, 10, 55];
//#endregion
//#region Girl stuff
var girl_accessories = [
    "black_sunglasses",
    "glasses",
    "pearl_necklace",
    "round_glasses",
    "solana_necklace",
];
var girl_accessory_weights = [30, 20, 10, 10, 30];
var girl_bodies = ["body_1", "body_2", "body_3"];
var girl_body_weights = [33, 33, 34];
var girl_footwears = [
    "black_ankle_boots",
    "black_high_heels",
    "red_ankle_boots",
    "white_ankle_boots",
    "white_high_heels",
];
var girl_footwear_weights = [27, 15, 27, 26, 5];
var girl_hairs = [
    "long_black_hair",
    "long_light_blue_hair",
    "long_orange_hair",
    "pink_hair",
    "short_maroon_hair",
    "short_red_hair",
];
var girl_hair_weights = [30, 5, 20, 10, 25, 10];
var girl_pants = [
    "blue_pants",
    "blue_skirt",
    "green_pants",
    "red_skirt",
    "white_pants",
];
var girl_pant_weights = [40, 5, 20, 5, 30];
var girl_shirts = [
    "pink_sweatshirt",
    "red_shirt",
    "shouldless_black_blouse",
    "strappy_blouse",
    "turquoise_shirt",
    "yellow_sweatshirt",
];
var girl_shirt_weights = [15, 10, 35, 25, 10, 5];
//#endregion
spinner.succeed();
var TOTAL_BOY = 15;
var ALL_BOY = [];
var TOTAL_GIRL = 15;
var ALL_GIRL = [];
var CURRENT_BOY_CONSECUTIVE = 0;
var CURRENT_GIRL_CONSECUTIVE = 1;
var getLayerUri = function (pseudoGender, layerType, layerName) {
    var layerUri = path.resolve(__dirname, "layers", pseudoGender, layerType, layerName + "." + (layerType === "background" ? "jpg" : "png"));
    spinner.info("Got layerUri: " + layerUri);
    return "" + layerUri;
};
var createBoyNFT = function () { return __awaiter(void 0, void 0, void 0, function () {
    var chance, backgroundItem, bodyItem, footwearItem, pantItem, shirtItem, sweaterItem, accessoryItem, hairItem, templateClone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner.start("Initializing boy creation: " + CURRENT_BOY_CONSECUTIVE);
                chance = new Chance();
                backgroundItem = chance.weighted(backgrounds, background_weights);
                bodyItem = chance.weighted(boy_bodies, boy_body_weights);
                footwearItem = chance.weighted(boy_footwear, boy_footwear_weights);
                pantItem = chance.weighted(boy_pants, boy_pant_weights);
                shirtItem = chance.weighted(boy_shirts, boy_shirt_weights);
                sweaterItem = chance.weighted(boy_sweaters, boy_sweater_weights);
                accessoryItem = chance.weighted(boy_accessories, boy_accessory_weights);
                hairItem = chance.weighted(boy_hairs, boy_hair_weights);
                spinner.info("Writing .jpg file");
                return [4 /*yield*/, new Promise(function (res, reject) {
                        return images(getLayerUri("boy", "background", backgroundItem))
                            .draw(images(getLayerUri("boy", "body", bodyItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "footwear", footwearItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "pant", pantItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "shirt", shirtItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "sweater", sweaterItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "accessory", accessoryItem)), 0, 0)
                            .draw(images(getLayerUri("boy", "hair", hairItem)), 0, 0)
                            .saveAsync(path.resolve(__dirname, "output", CURRENT_BOY_CONSECUTIVE.toString() + ".jpg"), function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                res();
                            }
                        });
                    })];
            case 1:
                _a.sent();
                spinner.info("Writing .json file");
                templateClone = JSON.parse(JSON.stringify(JSON_TEMPLATE));
                templateClone.name = "Metropolitan - " + CURRENT_BOY_CONSECUTIVE;
                templateClone.attributes = [
                    {
                        trait_type: "background",
                        value: backgroundItem,
                    },
                    { trait_type: "body", value: bodyItem },
                    { trait_type: "footwear", value: footwearItem },
                    { trait_type: "pant", value: pantItem },
                    { trait_type: "shirt", value: shirtItem },
                    { trait_type: "sweater", value: sweaterItem },
                    { trait_type: "accessory", value: accessoryItem },
                    { trait_type: "hair", value: hairItem },
                ];
                templateClone.image = CURRENT_BOY_CONSECUTIVE + ".jpg";
                return [4 /*yield*/, promisify(fs.writeFile)(path.resolve(__dirname, "output", CURRENT_BOY_CONSECUTIVE.toString() + ".json"), JSON.stringify(templateClone, null, 2), "utf-8")];
            case 2:
                _a.sent();
                spinner.succeed();
                ALL_BOY.push(templateClone);
                CURRENT_BOY_CONSECUTIVE += 2; // 2 Because we're intercalating boy-girl
                return [2 /*return*/];
        }
    });
}); };
var createGirlNFT = function () { return __awaiter(void 0, void 0, void 0, function () {
    var chance, backgroundItem, bodyItem, shirtItem, pantItem, footwearItem, accessoryItem, hairItem, templateClone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner.start("Initializing girl creation: " + CURRENT_GIRL_CONSECUTIVE);
                chance = new Chance();
                backgroundItem = chance.weighted(backgrounds, background_weights);
                bodyItem = chance.weighted(girl_bodies, girl_body_weights);
                shirtItem = chance.weighted(girl_shirts, girl_shirt_weights);
                pantItem = chance.weighted(girl_pants, girl_pant_weights);
                footwearItem = chance.weighted(girl_footwears, girl_footwear_weights);
                accessoryItem = chance.weighted(girl_accessories, girl_accessory_weights);
                hairItem = chance.weighted(girl_hairs, girl_hair_weights);
                // spinner.info(`Using ${backgroundItem} as background`);
                // spinner.info(`Using ${bodyItem} as body`);
                // spinner.info(`Using ${footwearItem} as footwear`);
                // spinner.info(`Using ${pantItem} as pant`);
                // spinner.info(`Using ${shirtItem} as shirt`);
                // spinner.info(`Using ${accessoryItem} as accessory`);
                // spinner.info(`Using ${hairItem} as hair`);
                spinner.info("Writing .jpg file");
                return [4 /*yield*/, new Promise(function (res, reject) {
                        return images(getLayerUri("boy", "background", backgroundItem))
                            .draw(images(getLayerUri("girl", "body", bodyItem)), 0, 0)
                            .draw(images(getLayerUri("girl", "shirt", shirtItem)), 0, 0)
                            .draw(images(getLayerUri("girl", "pant", pantItem)), 0, 0)
                            .draw(images(getLayerUri("girl", "footwear", footwearItem)), 0, 0)
                            .draw(images(getLayerUri("girl", "accessory", accessoryItem)), 0, 0)
                            .draw(images(getLayerUri("girl", "hair", hairItem)), 0, 0)
                            .saveAsync(path.resolve(__dirname, "output", CURRENT_GIRL_CONSECUTIVE.toString() + ".jpg"), function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                res();
                            }
                        });
                    })];
            case 1:
                _a.sent();
                spinner.info("Writing .json file");
                templateClone = JSON.parse(JSON.stringify(JSON_TEMPLATE));
                templateClone.name = "Metropolitan - " + CURRENT_GIRL_CONSECUTIVE;
                templateClone.attributes = [
                    {
                        trait_type: "background",
                        value: backgroundItem,
                    },
                    { trait_type: "body", value: bodyItem },
                    { trait_type: "footwear", value: footwearItem },
                    { trait_type: "pant", value: pantItem },
                    { trait_type: "shirt", value: shirtItem },
                    { trait_type: "accessory", value: accessoryItem },
                    { trait_type: "hair", value: hairItem },
                ];
                templateClone.image = CURRENT_GIRL_CONSECUTIVE + ".jpg";
                return [4 /*yield*/, promisify(fs.writeFile)(path.resolve(__dirname, "output", CURRENT_GIRL_CONSECUTIVE.toString() + ".json"), JSON.stringify(templateClone, null, 2), "utf-8")];
            case 2:
                _a.sent();
                spinner.succeed();
                ALL_GIRL.push(templateClone);
                CURRENT_GIRL_CONSECUTIVE += 2; // 2 Because we're intercalating boy-girl
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createBoyNFT()];
            case 1:
                _a.sent();
                return [4 /*yield*/, createGirlNFT()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (CURRENT_BOY_CONSECUTIVE < (TOTAL_BOY * 2) &&
                    CURRENT_GIRL_CONSECUTIVE < (TOTAL_GIRL * 2) - 1) return [3 /*break*/, 0];
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); })();
