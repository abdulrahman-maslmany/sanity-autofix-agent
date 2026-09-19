import { defineField, defineType } from 'sanity'

export const troubleshootType = defineType({
  name: 'troubleshoot',
  title: 'Troubleshooting Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'errorCode',
      title: 'Error Code (e.g. OBD-II)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'symptoms',
      title: 'Symptoms',
      type: 'text',
    }),
    defineField({
      name: 'solution',
      title: 'Recommended Fix',
      type: 'text',
    }),
    defineField({
      name: 'relatedParts',
      title: 'Related Replacement Parts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'part' }] }],
    }),
  ],
})