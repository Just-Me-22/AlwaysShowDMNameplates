/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

export default definePlugin({
    name: "AlwaysShowDMNameplates",
    description: "Shows the nameplate on every DM row that has one, instead of only on the hovered, focused or open conversation",
    authors: [{ name: "heart_menace", id: 281162701303185408n }],

    patches: [
        {
            find: '"PrivateChannel"',
            replacement: {
                match: /(\i)=null!=(\i)&&\(\i\|\|\i\|\|\i\);/,
                replace: "$1=null!=$2;"
            }
        }
    ]
});
