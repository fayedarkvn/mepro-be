import * as yaml from 'js-yaml';
import fs from 'fs';

const configurations = [];

if (fs.existsSync('config/default.yaml')) {
  configurations.push(() => yaml.load(fs.readFileSync('config/config.yaml', 'utf8')));
}

if (fs.existsSync(`config/${process.env.NODE_ENV}.yaml`)) {
  configurations.push(() => yaml.load(fs.readFileSync(`config/${process.env.NODE_ENV}.yaml`, 'utf8')));
}

export default configurations;
