export const CLASS_OPTIONS = [
  'Nursery',
  'LKG',
  'UKG',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
]

export const PRE_PRIMARY_CLASSES = ['Nursery', 'LKG', 'UKG']

export const formatClassLabel = (value) => {
  if (!value) return ''
  return PRE_PRIMARY_CLASSES.includes(value) ? value : `Class ${value}`
}
