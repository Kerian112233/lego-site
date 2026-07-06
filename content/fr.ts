import type {SiteContent} from './types';

/** Contenu FR — valeurs d'exemple LEXO (client #1). Éditable sans toucher au code. */
export const fr: SiteContent = {
  hero: {
    title: 'Louez votre scooter à Phuket en toute simplicité',
    subtitle:
      'Scooters récents et entretenus, assurance incluse. Réservez en 2 minutes sur WhatsApp.',
    ctaPrimary: 'Réserver mon scooter',
    ctaSecondary: 'Voir les modèles'
  },
  modelsPreview: {
    title: 'Notre flotte',
    subtitle:
      'Une flotte de plus de 150 scooters. Retrouvez le détail complet — couleurs et années — directement sur WhatsApp.',
    cta: 'Voir tous les scooters'
  },
  howItWorks: {
    title: 'Réservez en 3 étapes',
    subtitle: 'Simple, rapide, sans paiement en ligne.',
    steps: [
      {
        title: 'Choisissez votre scooter',
        description:
          'Parcourez la flotte et sélectionnez le modèle adapté à votre séjour.'
      },
      {
        title: 'Envoyez votre demande',
        description:
          'Remplissez le formulaire : dates, modèle et coordonnées.'
      },
      {
        title: 'On finalise sur WhatsApp',
        description:
          'On confirme la disponibilité et les derniers détails directement en message.'
      }
    ]
  },
  allInclusive: {
    title: 'La formule tout-compris',
    subtitle: 'Un seul tarif, aucune surprise.',
    items: [
      {
        title: 'Retrait au shop',
        description: 'Récupérez votre scooter prêt à rouler à notre boutique de Kathu.'
      },
      {
        title: 'Assurance incluse',
        description: 'Couverture de base incluse dans chaque location.'
      },
      {
        title: '2 casques fournis',
        description: 'Casques homologués pour vous et votre passager.'
      },
      {
        title: 'Assistance 7j/7',
        description: 'Une question, une panne ? On répond sur WhatsApp.'
      }
    ]
  },
  options: {
    title: 'Options & accessoires',
    subtitle: 'Personnalisez votre scooter selon vos envies.',
    note: 'D’autres accessoires sur demande — écrivez-nous sur WhatsApp.',
    items: [
      {
        name: 'Dosseret passager',
        description: 'Plus de confort et de maintien pour votre passager.'
      },
      {
        name: 'Échappement sport Akrapovic',
        description: 'Sonorité et look sport sur les modèles compatibles.'
      },
      {
        name: 'Top-case',
        description: 'Rangement verrouillable pour vos affaires et un casque.'
      }
    ]
  },
  faq: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce qu’il faut savoir avant de réserver.',
    items: [
      {
        question: 'Ai-je besoin d’un permis ?',
        answer:
          'Un permis moto international est recommandé et exigé par la loi thaïlandaise. Nous vous conseillons de rouler assuré et casqué.'
      },
      {
        question: 'Comment se passe la caution ?',
        answer:
          'La caution se fait uniquement par dépôt du passeport, remis à la prise du scooter et rendu au retour. Pas de caution en espèces. On vous explique tout sur WhatsApp.'
      },
      {
        question: 'Puis-je payer en ligne ?',
        answer:
          'Non, il n’y a pas de paiement en ligne. Vous envoyez votre demande, on confirme, et le règlement se fait à la remise du scooter.'
      },
      {
        question: 'Puis-je ajouter des options (dosseret, échappement sport) ?',
        answer:
          'Oui, plusieurs de nos scooters peuvent recevoir un dosseret, une ligne Akrapovic et d’autres accessoires. Demandez-nous sur WhatsApp.'
      }
    ]
  },
  reviews: {
    title: 'Ils nous ont fait confiance',
    subtitle: 'La satisfaction de nos clients, avis après avis.',
    rating: 4.9,
    count: 244,
    // Vrais avis Google (avatars : /reviews/*.jpg à déposer par le client).
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
    title: 'Nous trouver',
    subtitle: 'Passez nous voir ou contactez-nous quand vous voulez.'
  },
  openingHours: [{day: 'Tous les jours', time: '10:00 – 00:00'}],
  catalog: {
    title: 'Notre flotte de scooters',
    subtitle:
      'Choisissez le modèle adapté à votre séjour. Assurance incluse, options disponibles.'
  },
  seasons: {
    low: {name: 'Basse saison', period: 'du 01/05 au 30/11'},
    high: {name: 'Moyenne saison', period: 'du 01/12 au 14/12 et du 16/02 au 30/04'},
    peak: {name: 'Haute saison', period: 'du 15/12 au 15/02'}
  },
  reserve: {
    title: 'Réserver votre scooter',
    subtitle:
      'Remplissez le formulaire, on finalise ensemble sur WhatsApp. Aucun paiement en ligne.'
  }
};
