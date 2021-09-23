/**
 * Copyright 2021 - Kevin Rodriguez and Jungle Cats
 * Please do not disclose this source code to anyone not allowed by either
 * Kevin Rodriguez or Jungle Cats.
 * Distributing copies of this piece of code is a violation of copyright law.
 */
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
import _ from "lodash";
var DEV = true;
var __dirname = path.resolve();
var globalSpinner = ora({
    text: "Creating JSON Template",
    isSilent: !DEV,
}).start();
/**
 * GOTCHAS:
 * #0 - NFT file names should be a zero-based consecutive number.
 * #1 - PNG Files must be under 8MB I think, but it's HIGHLY desirable to keep them under 2MB.
 * #2 - All creators in the creators array must sign the created NFTs, this is kind of a bummer but it's better in terms of trust.
 *    - This way no one rugs no one, but it's still super important.
 *    - Ideally, we don't have to share our private keys, what we do is:
 *      - #1. Create a new keypair set for each creator.
 *      - #2. Send the cache file to every creator.
 *      - #3. Each creator signs the cache file using the metaplex cli. This sucks but it's the most transparent way to do it.
 *    - If you don't sign the NFTs, bad stuff happen.
 * #3 - File format must be png, i don't know why.
 * #4 - InitialSaleHappenned field is a boolean, ideally is set to true but this will close update authority; Update authority is important if something bad happens we can fix it.
 */
var JSON_TEMPLATE = {
    name: "",
    symbol: "",
    image: "0.png",
    description: "Welcome to the Jungle! Congratulations on getting your place in the Jungle Cats Family. https://junglecats.io",
    seller_fee_basis_points: 500,
    attributes: [],
    collection: {
        name: "Jungle Cats",
        family: "Originals",
    },
    properties: {
        files: [
            {
                uri: "junglecats.png",
                type: "image/png",
            },
        ],
        category: "image",
        creators: [
            {
                address: "JUNGLE_CATS_SPECIFIC_MINT_ADDRESS",
                share: 90,
            },
            {
                address: "OTHER_ADDRESS",
                share: 10,
            },
        ],
    },
};
globalSpinner.succeed();
globalSpinner.start("Creating layers and weights");
// #region JUNGLE_CAT layers stuff
/**
 * TODO: Modify accordingly to layers exported by Henzo
 * This process uses the charged dice to generate a random layer.
 * IMPORTANT: background_weights should add up to 100.
 * TODO: Refactor into a nice object that uses {LayerType} as key.
 */
var backgrounds = ["jungle", "space"];
var background_weights = [50, 50];
var junglecat_bodies = ["white_lion", "lion"];
var junglecat_body_weights = [50, 50];
var junglecat_manes = ["long_black", "long_brown"];
var junglecat_mane_weights = [50, 50];
var junglecat_shirts = ["black_shirt", "white_tank_top"];
var junglecat_shirt_weights = [50, 50];
var junglecat_accessories = [
    "black_sunglasses",
    "black_eyepatch",
    "none", // A none, empty layer should also be part of the weights otherwise everyone will have a feature.
];
var junglecat_accessory_weights = [33, 33, 34];
//#endregion
globalSpinner.succeed();
var TOTAL_JUNGLECATS = 30; // Change to appropiate number
var ALL_JUNGLECATS = [];
var getLayerUri = function (layerType, layerName) {
    var spinner = ora({
        text: "Building file from layer " + layerType + " and " + layerName,
        isSilent: !DEV,
    }).start();
    var layerUri = path.resolve(__dirname, "layers", layerType, layerName + ".png");
    spinner.info("Got layerUri: " + layerUri);
    return "" + layerUri;
};
var createJungleCatNFT = function (currentJunglecatConsecutive) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, chance, backgroundItem, bodyItem, shirtItem, accessoryItem, maneItem, templateClone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora({
                    text: "Creating JungleCat " + currentJunglecatConsecutive,
                    isSilent: !DEV,
                }).start();
                chance = new Chance();
                backgroundItem = chance.weighted(backgrounds, background_weights);
                bodyItem = chance.weighted(junglecat_bodies, junglecat_body_weights);
                shirtItem = chance.weighted(junglecat_shirts, junglecat_shirt_weights);
                accessoryItem = chance.weighted(junglecat_accessories, junglecat_accessory_weights);
                maneItem = chance.weighted(junglecat_manes, junglecat_mane_weights);
                spinner.info("Writing .png file for JungleCat - " + currentJunglecatConsecutive);
                /**
                 * SUPER IMPORTANT
                 * - The order of layers is MATTERS, imagine putting them in photoshop or something like that.
                 */
                return [4 /*yield*/, new Promise(function (res, reject) {
                        return images(getLayerUri("background", backgroundItem))
                            .draw(images(getLayerUri("body", bodyItem)), 0, 0)
                            .draw(images(getLayerUri("shirt", shirtItem)), 0, 0)
                            .draw(images(getLayerUri("accessory", accessoryItem)), 0, 0)
                            .draw(images(getLayerUri("mane", maneItem)), 0, 0)
                            .saveAsync(path.resolve(__dirname, "output", currentJunglecatConsecutive.toString() + ".png"), function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                res();
                            }
                        });
                    })];
            case 1:
                /**
                 * SUPER IMPORTANT
                 * - The order of layers is MATTERS, imagine putting them in photoshop or something like that.
                 */
                _a.sent();
                spinner.info("Writing .json file");
                templateClone = JSON.parse(JSON.stringify(JSON_TEMPLATE));
                templateClone.name = "Jungle Cats - #" + currentJunglecatConsecutive;
                templateClone.attributes = [
                    // These show up very nice in Phantom and other wallets.
                    {
                        trait_type: "background",
                        value: backgroundItem,
                    },
                    { trait_type: "body", value: bodyItem },
                    { trait_type: "shirt", value: shirtItem },
                    { trait_type: "accessory", value: accessoryItem },
                    { trait_type: "mane", value: maneItem },
                ];
                templateClone.image = currentJunglecatConsecutive + ".png";
                return [4 /*yield*/, promisify(fs.writeFile)(path.resolve(__dirname, "output", currentJunglecatConsecutive.toString() + ".json"), JSON.stringify(templateClone, null, 2), "utf-8")];
            case 2:
                _a.sent();
                spinner.succeed();
                ALL_JUNGLECATS.push(templateClone);
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentConsecutive, promises, promise, attrsAndIds, repeatedAttrs, repeated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentConsecutive = 0;
                promises = [];
                do {
                    promise = createJungleCatNFT(currentConsecutive);
                    promises.push(promise);
                    currentConsecutive += 1;
                } while (currentConsecutive < TOTAL_JUNGLECATS);
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                _a.sent();
                attrsAndIds = ALL_JUNGLECATS.map(function (i) { return ({
                    id: i.name,
                    attrs: JSON.stringify(i.attributes),
                }); });
                repeatedAttrs = _.filter(attrsAndIds.map(function (i) { return i.attrs; }), function (val, i, iteratee) { return _.includes(iteratee, val, i + 1); });
                repeated = attrsAndIds.filter(function (i) {
                    return repeatedAttrs.includes(i.attrs);
                });
                globalSpinner.info("Repeated items: " + JSON.stringify(repeated, null, 2));
                globalSpinner.succeed();
                return [2 /*return*/];
        }
    });
}); })();
