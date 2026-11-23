/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

const HEX = /^#[0-9a-f]{6}$/i;

interface Nameplate { palette?: { darkBackground?: string; }; }

export default definePlugin({
    name: "AlwaysShowDMNameplates",
    description: "Shows the nameplate on every DM row that has one, instead of only on the hovered, focused or open conversation, and gives DM and member list rows their nameplate colour as --vc-plate-tint for themes",
    authors: [{ name: "heart_menace", id: 281162701303185408n }],

    patches: [
        {
            find: "PrivateChannel.renderAvatar",
            replacement: [
                {
                    match: /(\i)=null!=(\i)&&\(\i\|\|\i\|\|\i\)(?=[,;])/,
                    replace: "$1=null!=$2"
                },
                {
                    match: /(\(0,\i\.jsxs\)\(\i,\{className:\i\(\)\(\i\.\i,\i\.dm\),)(?=role:\i,[^]{0,800}?nameplate:\i\?(\i):void 0)/,
                    replace: "$1style:$self.tint($2),"
                }
            ]
        },
        {
            find: "lostPermissionTooltipText:",
            replacement: {
                match: /(nameplate:(\i),)(?=subText:)/,
                replace: "$1style:$self.tint($2),"
            }
        }
    ],

    tint(nameplate: Nameplate | null | undefined) {
        const color = nameplate?.palette?.darkBackground;
        return typeof color === "string" && HEX.test(color) ? { "--vc-plate-tint": color } : undefined;
    }
});
