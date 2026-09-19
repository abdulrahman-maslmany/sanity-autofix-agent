import { defineField, defineType } from 'sanity'

export const vehicleType = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Vehicle Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'make',
      title: 'Make / Manufacturer',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Model Year',
      type: 'number',
    }),
    defineField({
      name: 'engineType',
      title: 'Engine Type',
      type: 'string',
    }),
  ],
})