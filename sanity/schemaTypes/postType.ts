import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'country',
      title: 'Pays',
      type: 'string',
      options: {
        list: [
          {title: 'Brésil', value: 'br'},
          {title: 'France', value: 'fr'},
          {title: 'Portugal', value: 'pt'},
          {title: 'Canada', value: 'ca'},
          {title: 'États-Unis', value: 'us'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      rows: 3,
      description: 'Résumé court de l\'article (150-200 caractères)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    // SEO Fields
    defineField({
      name: 'metaTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre pour les moteurs de recherche (si différent du titre principal)',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 3,
      description: 'Description pour les moteurs de recherche (150-160 caractères)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Image Open Graph',
      type: 'image',
      description: 'Image pour les réseaux sociaux (si différente de l\'image principale)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Article en vedette',
      type: 'boolean',
      description: 'Marquer comme article en vedette',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      country: 'country',
    },
    prepare(selection) {
      const {author, country} = selection
      return {...selection, subtitle: author && `par ${author} - ${country?.toUpperCase()}`}
    },
  },
  orderings: [
    {
      title: 'Date de publication, Nouveau',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Date de publication, Ancien',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})

