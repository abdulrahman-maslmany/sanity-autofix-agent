import { defineField, defineType } from 'sanity'

export const partType = defineType({
  name: 'part',
  title: 'Spare Part',
  type: 'document',
  fields: [
    defineField({
      name: 'partNumber',
      title: 'Part Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Part Title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'text',
    }),
    defineField({
      name: 'compatibleVehicles',
      title: 'Compatible Vehicles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'vehicle' }] }],
    }),
  ],
})