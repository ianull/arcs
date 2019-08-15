/**
 * @license
 * Copyright 2019 Google LLC.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {Utils} from '../../lib/runtime/utils.js';

const manifest = `
import 'https://$particles/Notification/Notification.arcs'
import 'https://$particles/Restaurants/Restaurants.arcs'
`;

export const requireContext = async () => {
  if (!requireContext.promise) {
    requireContext.promise = Utils.parse(manifest);
  }
  return await requireContext.promise;
};
