import type {SiteContent} from './types';

/** EN content — LEXO (client #1) sample values. Editable without touching code. */
export const en: SiteContent = {
  hero: {
    title: 'Rent your scooter in Phuket, made simple',
    subtitle:
      'Recent, well-maintained scooters, insurance included. Book in 2 minutes on WhatsApp.',
    ctaPrimary: 'Book my scooter',
    ctaSecondary: 'View models'
  },
  modelsPreview: {
    title: 'Our fleet',
    subtitle:
      'A fleet of over 150 scooters. See the full lineup — colours and years — directly on WhatsApp.',
    cta: 'View all scooters'
  },
  howItWorks: {
    title: 'Book in 3 steps',
    subtitle: 'Simple, fast, no online payment.',
    steps: [
      {
        title: 'Pick your scooter',
        description: 'Browse the fleet and choose the model that fits your trip.'
      },
      {
        title: 'Send your request',
        description: 'Fill in the form: dates, model and contact details.'
      },
      {
        title: 'We finalise on WhatsApp',
        description: 'We confirm availability and the final details right in the chat.'
      }
    ]
  },
  allInclusive: {
    title: 'The all-inclusive deal',
    subtitle: 'One price, no surprises.',
    items: [
      {
        title: 'Shop pickup',
        description: 'Collect your ready-to-ride scooter at our Kathu shop.'
      },
      {
        title: 'Insurance included',
        description: 'Basic coverage included with every rental.'
      },
      {
        title: '2 helmets provided',
        description: 'Certified helmets for you and your passenger.'
      },
      {
        title: '7-day support',
        description: 'A question or a breakdown? We answer on WhatsApp.'
      }
    ]
  },
  options: {
    title: 'Options & accessories',
    subtitle: 'Customise your scooter the way you like.',
    note: 'Other accessories on request — message us on WhatsApp.',
    items: [
      {
        name: 'Passenger backrest',
        description: 'Extra comfort and support for your passenger.'
      },
      {
        name: 'Akrapovic sport exhaust',
        description: 'Sportier sound and looks on compatible models.'
      },
      {
        name: 'Top-case',
        description: 'Lockable storage for your belongings and a helmet.'
      }
    ]
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: 'Everything you need to know before booking.',
    items: [
      {
        question: 'Do I need a licence?',
        answer:
          'An international motorcycle licence is recommended and required by Thai law. We advise riding insured and with a helmet.'
      },
      {
        question: 'How does the deposit work?',
        answer:
          'The deposit is your passport only, handed over when you collect the scooter and returned when you bring it back. No cash deposit. We explain everything on WhatsApp.'
      },
      {
        question: 'Can I pay online?',
        answer:
          'No, there is no online payment. You send your request, we confirm, and payment is made when you pick up the scooter.'
      },
      {
        question: 'Can I add options (backrest, sport exhaust)?',
        answer:
          'Yes, many of our scooters can be fitted with a backrest, an Akrapovic exhaust and other accessories. Just ask us on WhatsApp.'
      }
    ]
  },
  reviews: {
    title: 'Trusted by travellers',
    subtitle: 'Our customers’ satisfaction, review after review.',
    rating: 4.9,
    count: 244,
    // Real Google reviews (avatars: drop /reviews/*.jpg). Kept in original language.
    items: [
      {
        author: 'Mehdi',
        photo: '/reviews/mehdi.jpg',
        text: 'Service au top ! Scooter en parfait état, très propre et fiable. La personne a été super arrangeante, disponible et professionnelle du début à la fin. Je recommande à 100 %, vous pouvez y aller les yeux fermés !'
      },
      {
        author: 'Selin Urgan',
        text: 'Superbe personne, location de scooter comme excursions, rien à dire, une superbe agence ! Le personnel est toujours disponible sur WhatsApp. Le luxe de Phuket, je recommande à 100 % 👌'
      },
      {
        author: 'Hedi Oua',
        photo: '/reviews/hedi.jpg',
        text: 'À chaque séjour à Phuket, lorsque je loue un scooter, je fais appel à Lexo : un service fiable, sympathique et toujours ponctuel.'
      }
    ]
  },
  hoursMap: {
    title: 'Find us',
    subtitle: 'Drop by or reach out anytime.'
  },
  openingHours: [{day: 'Every day', time: '10:00 – 00:00'}],
  catalog: {
    title: 'Our scooter fleet',
    subtitle:
      'Pick the model that fits your trip. Insurance included, add-on options available.'
  },
  reserve: {
    title: 'Book your scooter',
    subtitle:
      "Fill in the form, we finalise together on WhatsApp. No online payment."
  }
};
