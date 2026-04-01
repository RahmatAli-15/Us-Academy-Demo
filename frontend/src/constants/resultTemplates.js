import { PRE_PRIMARY_CLASSES } from './classes'

export const PRE_PRIMARY_SUBJECTS = [
  { key: 'english', label: 'English', apiKey: 'ENGLISH' },
  { key: 'hindi', label: 'Hindi', apiKey: 'HINDI' },
  { key: 'maths', label: 'Maths', apiKey: 'MATHS' },
  { key: 'urdu', label: 'Urdu', apiKey: 'URDU' },
  { key: 'gk', label: 'GK', apiKey: 'GK' },
  { key: 'pt', label: 'P.T.', apiKey: 'PT' },
  { key: 'art', label: 'Art', apiKey: 'ART' },
]

export const CLASS_1_TO_10_SUBJECTS = [
  { key: 'english', label: 'English', apiKey: 'ENGLISH' },
  { key: 'english_grammar', label: 'English Grammar', apiKey: 'ENGLISH_GRAMMAR' },
  { key: 'hindi', label: 'Hindi', apiKey: 'HINDI' },
  { key: 'hindi_grammar', label: 'Hindi Grammar', apiKey: 'HINDI_GRAMMAR' },
  { key: 'maths', label: 'Maths', apiKey: 'MATHS' },
  { key: 'evs_science', label: 'E.V.S / Science', apiKey: 'EVS_SCIENCE' },
  { key: 'urdu', label: 'Urdu', apiKey: 'URDU' },
  { key: 'computer', label: 'Computer', apiKey: 'COMPUTER' },
  { key: 'gk', label: 'GK', apiKey: 'GK' },
  { key: 'ms_sst', label: 'M.S. / SST', apiKey: 'MS_SST' },
  { key: 'art', label: 'Art', apiKey: 'ART' },
]

export const getSubjectsForClass = (classValue) =>
  PRE_PRIMARY_CLASSES.includes(classValue) ? PRE_PRIMARY_SUBJECTS : CLASS_1_TO_10_SUBJECTS
