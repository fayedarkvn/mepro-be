import * as yaml from 'js-yaml';
import fs from 'node:fs';
import { env } from 'node:process';

export const configurations = [];

if (fs.existsSync('config/default.yaml')) {
  configurations.push(() => yaml.load(fs.readFileSync('config/default.yaml', 'utf8')));
}

if (fs.existsSync(`config/${env.NODE_ENV}.yaml`)) {
  configurations.push(() => yaml.load(fs.readFileSync(`config/${env.NODE_ENV}.yaml`, 'utf8')));
}
