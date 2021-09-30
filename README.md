![Candies](https://images.unsplash.com/photo-1581798269145-7512508289b9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=852&h=200&q=80)

# Candy Maker

Metaplex compliant - generative art script.
I hope some day it becomes a fully fledged cli.

## Usage Instructions

1. Modify `index.ts` to match your project.
2. Run `yarn all`.

### Constants to modify

- `DEV` - Indicates whether to output logs or not.
- `TOTAL_NFTITEMS` - Amount of Image/Metadata pairs to create.
- `ALL_NFTITEMS` - JSON Template containing all the NFTItems, modify the script to save it if you want to use a rarity service.
- `type LayerType` - Should match your layer folders.
- `JSON_TEMPLATE` - Super important, edit to match your project.
- `#region layers` - Everything here should match the layers included in the `layers` folder, by name. Weights should add up to a 100% and match the layers positionally.
- `#region Chose by weight` - Just be sure it matches the layers.
- `#region Image Assembly` - Use this to assemble the image, make sure it has a logical order and matches the layers.
- `#region Metadata for this NFT` - Here is the specific data for the current NFT, usually just `name`, `atrributes` and `image` changes.
