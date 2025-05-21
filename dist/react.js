import React, { createContext, useContext } from 'react';
import { trans as linguaTrans } from './translator.js';

// Create LinguaContext
const LinguaContext = createContext();

// LinguaProvider Component
const LinguaProvider = ({ locale, Lingua, children }) => {
  return (
    <LinguaContext.Provider value={{ locale, Lingua }}>
      {children}
    </LinguaContext.Provider>
  );
};

// useLingua Hook
const useLingua = () => {
  const context = useContext(LinguaContext);
  if (!context) {
    throw new Error('useLingua must be used within a LinguaProvider');
  }

  const { locale, Lingua } = context;

  const trans = (key, replacements = {}) => {
    // Call linguaTrans with pluralizeBoolean = false
    return linguaTrans(key, replacements, false, { Lingua, locale });
  };

  const transChoice = (key, number, replacements = {}) => {
    // Add count to replacements and call linguaTrans with pluralizeBoolean = true
    const newReplacements = { ...replacements, count: number };
    return linguaTrans(key, newReplacements, true, { Lingua, locale });
  };

  return { locale, trans, transChoice };
};

export { LinguaProvider, useLingua, LinguaContext };
