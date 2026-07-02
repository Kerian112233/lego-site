import type {SiteContent} from './types';

/** EN content — LEXO (client #1) sample values. Editable without touching code. */
export const en: SiteContent = {
  hero: {
    title: 'Rent your scooter in Phuket, delivered to your door',
    subtitle:
      'Recent, well-maintained scooters, delivered to your hotel, insurance included. Book in 2 minutes on WhatsApp.',
    ctaPrimary: 'Book my scooter',
    ctaSecondary: 'View models'
  },
  modelsPreview: {
    title: 'Our fleet',
    subtitle: 'From the 110cc city runabout to the maxi-scooter, a model for every ride.',
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
        description: 'Fill in the form: dates, delivery location and contact details.'
      },
      {
        title: 'We finalise on WhatsApp',
        description: 'We confirm availability and delivery right in the chat.'
      }
    ]
  },
  allInclusive: {
    title: 'The all-inclusive deal',
    subtitle: 'One price, no surprises.',
    items: [
      {
        title: 'Delivery & pickup',
        description: 'To your hotel or the airport, anywhere on the island.'
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
  whyUs: {
    title: 'Why choose us',
    subtitle: 'Hundreds of travellers trust us every season.',
    items: [
      {
        title: 'Recent scooters',
        description: 'Fleet renewed and serviced after every rental.'
      },
      {
        title: 'Transparent pricing',
        description: 'Weekly and monthly discounts, no hidden fees.'
      },
      {
        title: 'Stress-free booking',
        description: 'No online payment — everything is settled in person.'
      }
    ]
  },
  deliveryZones: {
    title: 'Delivery zones',
    subtitle: 'We deliver everywhere in Phuket.',
    note: 'Other zones on request — message us on WhatsApp.',
    zones: [
      {name: 'Patong', price: 'Free'},
      {name: 'Karon', price: '100 ฿'},
      {name: 'Kata', price: '100 ฿'},
      {name: 'Kamala', price: '150 ฿'},
      {name: 'Phuket Town', price: '200 ฿'},
      {name: 'Airport', price: '300 ฿'}
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
          'The deposit is settled on delivery, in cash or via passport depending on the model. We explain everything on WhatsApp.'
      },
      {
        question: 'Can I pay online?',
        answer:
          'No, there is no online payment. You send your request, we confirm, and payment is made on delivery.'
      },
      {
        question: 'Do you deliver to the airport?',
        answer:
          'Yes, we deliver to Phuket airport as well as to your hotel anywhere on the island.'
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
      'Pick the model that fits your trip. Delivered to your hotel, insurance included.'
  },
  reserve: {
    title: 'Book your scooter',
    subtitle:
      "Fill in the form, we finalise together on WhatsApp. No online payment."
  }
};
