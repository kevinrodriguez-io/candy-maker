import { Chance } from "chance";
import images from "images";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import ora from "ora";
import _ from "lodash";

const __dirname = path.resolve();

const DEV = true;
const TOTAL_NFTITEMS = 10; // Change to appropiate number
const ALL_NFTITEMS: Array<typeof JSON_TEMPLATE> = [];

type LayerType = "background" | "body" | "accessory" | "beard" | "shirt"; // Matches the {folder} placed as in ./layers/{folder}

type Attribute = {
  trait_type: LayerType;
  value: string;
};

const globalSpinner = ora({
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
 *    - If you don't sign the NFTs after the initial drop, some people say bad stuff happen.
 * #3 - File format must be png, i don't know why.
 * #4 - InitialSaleHappenned field is a boolean, ideally is set to true but this will close update authority; Update authority is important if something bad happens we can fix it.
 */
const JSON_TEMPLATE = {
  name: "", // Modified by script
  symbol: "",
  image: "0.png", /// Modified by script
  description: "Some description",
  seller_fee_basis_points: 500, // 500 = 5%
  attributes: [] as Attribute[],
  collection: {
    name: "Your NFT Project",
    family: "Your NFT Project Family",
  },
  properties: {
    files: [
      {
        uri: "nft.png",
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: "SPECIFIC_MINT_ADDRESS", // CAREFUL NOT TO USE A LEDGER ONE BECAUSE WE'LL NEED IT'S PRIVATE KEY TO SIGN EVERY PIECE USING METAPLEX CLI.
        share: 90,
      },
      {
        address: "OTHER_ADDRESS", // CAREFUL, PRIVATE KEY WILL BE NEEDED TO SIGN EVERY ART PIECE VIA CLI AFTER INITIAL SALES.
        share: 10,
      },
    ],
  },
};

globalSpinner.succeed();
globalSpinner.start("Creating layers and weights");

//#region Layers

/**
 * TODO: Modify accordingly
 * This process uses the charged dice to generate a random layer.
 * IMPORTANT: background_weights should add up to 100.
 * TODO: Refactor into a nice object that uses {LayerType} as key.
 */

const backgrounds = ["jungle", "space"];
const background_weights = [50, 50];

const nftitem_bodies = ["black", "white"];
const nftitem_body_weights = [50, 50];

const nftitem_beards = ["long_black", "long_brown"];
const nftitem_beard_weights = [50, 50];

const nftitem_shirts = ["black_shirt", "white_tank_top"];
const nftitem_shirt_weights = [50, 50];

const nftitem_accessories = [
  "black_sunglasses",
  "black_eyepatch",
  "none", // A none, empty layer should also be part of the weights otherwise everyone will have a feature.
];
const nftitem_accessory_weights = [33, 33, 34];

//#endregion

globalSpinner.succeed();

const getLayerUri = (layerType: LayerType, layerName: string) => {
  const spinner = ora({
    text: `Building file from layer ${layerType} and ${layerName}`,
    isSilent: !DEV,
  }).start();
  const layerUri = path.resolve(
    __dirname,
    "layers",
    layerType,
    `${layerName}.png`
  );
  spinner.info(`Got layerUri: ${layerUri}`);
  return `${layerUri}`;
};

const createNFTItem = async (currentNFTItemConsecutive: number) => {
  const spinner = ora({
    text: `Creating NFTItem ${currentNFTItemConsecutive}`,
    isSilent: !DEV,
  }).start();
  const chance = new Chance();

  //#region Chose by weight
  const backgroundItem = chance.weighted(backgrounds, background_weights); // Pick a background
  const bodyItem = chance.weighted(nftitem_bodies, nftitem_body_weights); // Pick a body
  const shirtItem = chance.weighted(nftitem_shirts, nftitem_shirt_weights); // Pick a shirt
  const accessoryItem = chance.weighted(
    nftitem_accessories,
    nftitem_accessory_weights
  ); // Pick an accessory
  const beardItem = chance.weighted(nftitem_beards, nftitem_beard_weights); // Pick a mane
  //#endregion

  spinner.info(`Writing .png file for NFTItem - ${currentNFTItemConsecutive}`);

  //#region Image Assembly
  /**
   * SUPER IMPORTANT
   * - The order of layers is MATTERS, imagine putting them in photoshop or something like that.
   */
  await new Promise<void>((res, reject) =>
    images(getLayerUri("background", backgroundItem))
      .draw(images(getLayerUri("body", bodyItem)), 0, 0)
      .draw(images(getLayerUri("shirt", shirtItem)), 0, 0)
      .draw(images(getLayerUri("accessory", accessoryItem)), 0, 0)
      .draw(images(getLayerUri("beard", beardItem)), 0, 0)
      .saveAsync(
        path.resolve(
          __dirname,
          "output",
          `${currentNFTItemConsecutive.toString()}.png`
        ),
        (err) => {
          if (err) {
            reject(err);
          } else {
            res();
          }
        }
      )
  );
  //#endregion

  spinner.info("Writing .json file");
  const templateClone = JSON.parse(
    JSON.stringify(JSON_TEMPLATE)
  ) as typeof JSON_TEMPLATE;

  //#region Metadata for this NFT
  templateClone.name = `NFTItem - #${currentNFTItemConsecutive}`;
  templateClone.attributes = [
    // These show up very nice in Phantom and other wallets.
    {
      trait_type: "background",
      value: backgroundItem,
    },
    { trait_type: "body", value: bodyItem },
    { trait_type: "shirt", value: shirtItem },
    { trait_type: "accessory", value: accessoryItem },
    { trait_type: "beard", value: beardItem },
  ];
  templateClone.image = `${currentNFTItemConsecutive}.png`;
  //#endregion
  await promisify(fs.writeFile)(
    path.resolve(
      __dirname,
      "output",
      `${currentNFTItemConsecutive.toString()}.json`
    ),
    JSON.stringify(templateClone, null, 2),
    "utf-8"
  );
  spinner.succeed();
  ALL_NFTITEMS.push(templateClone);
};

(async () => {
  let currentConsecutive = 0;
  const promises: Promise<void>[] = [];
  do {
    const promise = createNFTItem(currentConsecutive);
    promises.push(promise);
    currentConsecutive += 1;
  } while (currentConsecutive < TOTAL_NFTITEMS);
  await Promise.all(promises);
  const attrsAndIds = ALL_NFTITEMS.map((i) => ({
    id: i.name,
    attrs: JSON.stringify(i.attributes),
  }));
  const repeatedAttrs = _.filter(
    attrsAndIds.map((i) => i.attrs),
    (val, i, iteratee) => _.includes(iteratee, val, i + 1)
  );
  const repeated = attrsAndIds.filter((i) => repeatedAttrs.includes(i.attrs));
  console.log(`Repeated items: ${JSON.stringify(repeated, null, 2)}`);
  console.log(
    `If there are too many repeated Items try adding more features or manually edit them to add some really unique items.`
  );
  globalSpinner.succeed();
})();
