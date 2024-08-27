'use client';
import Hero from './Hero';
import { createContext } from 'react';
import Map from './Map';
import Results from './Results';

export const MapContext = createContext();

export default function CandidatesPage(props) {
  console.log('props', props.campaigns);
  return (
    <MapContext.Provider value={props}>
      <Hero />
      <div className="h-[calc(100vh-56px-96px)] md:flex flex-row-reverse border-t border-gray-300">
        <Map />
        <Results />
      </div>
    </MapContext.Provider>
  );
}
