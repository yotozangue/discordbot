import path from 'path';

import { glob } from 'glob';
import { promisify } from 'util';


export const getFiles = async (thing: string): Promise<string[]> => {
    if (!require.main) {
        throw new Error('[ERROR] No require.main')
    }
    return await promisify(glob)(`${path.dirname(require.main.filename)}/modules/bot/${thing}/**/*{.ts,.js}`);
};
