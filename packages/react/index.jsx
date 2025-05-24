import React, { createContext, useContext } from 'react';
import { trans as linguaTrans } from '@cyberwolf.studio/lingua-core';

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

  const trans = (key, replacements = {}, pluralize = false) => {
    return linguaTrans(key, replacements, pluralize, { Lingua, locale });
  };

  const __ = (key, replacements = {}, pluralize = false) => {
    return trans(key, replacements, pluralize);
  };

  const transChoice = (key, number, replacements = {}) => {
    const newReplacements = { ...replacements, count: number };
    return linguaTrans(key, newReplacements, true, { Lingua, locale });
  };

  return { locale, trans, transChoice, __ };
};

export { LinguaProvider, useLingua, LinguaContext, useLingua as default };
