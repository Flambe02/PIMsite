export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Important pour l\'accessibilité et le SEO',
          options: {
            isHighlighted: true,
          },
        },
      ],
    },
    {
      name: 'country',
      title: 'Pays',
      type: 'string',
      options: {
        list: [
          { title: 'Brésil', value: 'br' },
          { title: 'France', value: 'fr' },
          { title: 'Portugal', value: 'pt' },
          { title: 'Canada', value: 'ca' },
          { title: 'États-Unis', value: 'us' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      rows: 3,
      description: 'Résumé court de l\'article (150-200 caractères)',
      validation: (Rule: any) => Rule.max(200),
    },
    {
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Légende',
            },
          ],
        },
        {
          type: 'code',
          options: {
            withFilename: true,
          },
        },
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    // SEO Fields
    {
      name: 'metaTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre pour les moteurs de recherche (si différent du titre principal)',
    },
    {
      name: 'metaDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 3,
      description: 'Description pour les moteurs de recherche (150-160 caractères)',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'ogImage',
      title: 'Image Open Graph',
      type: 'image',
      description: 'Image pour les réseaux sociaux (si différente de l\'image principale)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Article en vedette',
      type: 'boolean',
      description: 'Marquer comme article en vedette',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      country: 'country',
    },
    prepare(selection: any) {
      const { author, country } = selection;
      return {
        ...selection,
        subtitle: author && `par ${author} - ${country?.toUpperCase()}`,
      };
    },
  },
  orderings: [
    {
      title: 'Date de publication, Nouveau',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Date de publication, Ancien',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
}; 