// @flow
// @format

import db from './db';
import {createApp} from './app';

createApp().listen(3000, () => console.log('Listening on 3000'));
