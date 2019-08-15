/**
 * @license
 * Copyright 2019 Google LLC.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {generateId} from '../../../../modalities/dom/components/generate-id.js';
import {Utils} from '../../../lib/runtime/utils.js';
import {marshalOutput} from '../lib/utils.js';
import {portIndustry} from '../pec-port.js';
import {logsFactory} from '../../../../build/runtime/log-factory.js';

const {warn} = logsFactory('pipe');

export const spawn = async ({modality, recipe}, tid, bus, composerFactory, storage, context) => {
  const action = context.allRecipes.find(r => r.name === recipe);
  if (recipe && !action) {
    warn(`found no recipes matching [${recipe}]`);
    return null;
  } else {
    // instantiate arc
    const arc = await Utils.spawn({
      context,
      //storage,
      id: generateId(),
      composer: composerFactory(modality, bus, tid),
      portFactories: [portIndustry(bus)]
    });
    // optionally instantiate recipe
    if (action) {
      if (await instantiateRecipe(arc, action)) {
        observeOutput(tid, bus, arc);
      }
    }
    return arc;
  }
};

export const instantiateRecipeByName = async (arc, name) => {
  const recipe = arc.context.allRecipes.find(r => r.name === name);
  if (!recipe) {
    warn(`found no recipes matching [${name}]`);
  } else {
    await instantiateRecipe(arc, recipe);
  }
};

const instantiateRecipe = async (arc, recipe) => {
  const plan = await Utils.resolve(arc, recipe);
  if (!plan) {
    warn('failed to resolve recipe');
    return false;
  }
  await arc.instantiate(plan);
  return true;
};

const observeOutput = async (tid, bus, arc) => {
  // TODO(sjmiles): need better system than 20-and-out
  for (let i=0; i<20; i++) {
    const entity = await marshalOutput(arc);
    if (entity) {
      const data = JSON.parse(entity.rawData.json);
      bus.send({message: 'data', tid, data});
    }
  }
};

