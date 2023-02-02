import { User } from "discord.js";
import { Source } from "../enums/source-media.enum";

export interface MusicData {
    title: string;
    url: string;
    thumbnail?: string;
    source: Source;
    duration: string;
    user?: User;
}
