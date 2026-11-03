const fs = require('fs');

const data = `export const CATEGORIES = [
  {
    id: 'advertisement',
    title: 'ADVERTISEMENT',
    coverIcon: '/icons/ADVERTISEMENT.png',
    artist: 'Basil Jose',
    tagline: 'High-production luxury spots, studio lighting campaigns, and kinetic product films.',
    projects: [
      {
        id: 'ad-aurea',
        title: 'AUREA Luxury Commercial',
        client: 'Maison Aurea • 2024',
        role: 'Art Direction & Commercial Editing',
        description: 'Cinematic brand campaign for luxury fragrance featuring architectural studio lighting and fluid motion.',
        folder: '/content/advertisement/ad-aurea/',
        thumbnail: '/frames/web10.webp',
        stampCode: 'PAR AVION // 2024',
        city: 'PARIS',
        dateStamp: '12 OCT 2024',
        formatTag: 'AIRMAIL POSTCARD',
        media: [
          {
            title: 'AUREA Cinematic Reveal (4K)',
            caption: 'Main Broadcast Master • 60s Cut',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/advertisement/ad-aurea/reel.mp4'
          }
        ]
      },
      {
        id: 'ad-horizon',
        title: 'Velvet Horizon Spirits',
        client: 'Highland Distillers • 2024',
        role: 'Directing & Color Grading',
        description: 'Atmospheric visual narrative capturing barrel maturation and golden amber spirits in natural twilight.',
        folder: '/content/advertisement/ad-horizon/',
        thumbnail: '/frames/web16.webp',
        stampCode: 'AIR MAIL // 2024',
        city: 'LONDON',
        dateStamp: '28 AUG 2024',
        formatTag: 'EDITORIAL MEMO',
        media: [
          {
            title: 'Velvet Horizon Teaser',
            caption: 'Brand Teaser Spot',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/advertisement/ad-aurea/reel.mp4'
          }
        ]
      },
      {
        id: 'ad-prism',
        title: 'Prism Chrono Timepieces',
        client: 'Horology Genève • 2024',
        role: 'Macro Cinematography & VFX',
        description: 'Close-up horological movement study exploring precision sapphire gears, escapements, and tourbillons.',
        folder: '/content/advertisement/ad-prism/',
        thumbnail: '/frames/web22.webp',
        stampCode: 'CHRONO // 2024',
        city: 'GENEVA',
        dateStamp: '15 MAY 2024',
        formatTag: 'ARCHIVE INDEX',
        media: [
          {
            title: 'Precision Escapement Study',
            caption: 'Macro Optical Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web22.webp'
          }
        ]
      },
      {
        id: 'ad-volt',
        title: 'Volt Kinetic Footwear',
        client: 'Acro Athletics • 2024',
        role: 'Speed-Ramping & Sound Design',
        description: 'High-octane urban running commercial shot across rain-slicked city streets with dynamic lighting rigs.',
        folder: '/content/advertisement/ad-volt/',
        thumbnail: '/frames/web28.webp',
        stampCode: 'KINETIC // 2024',
        city: 'BERLIN',
        dateStamp: '04 FEB 2024',
        formatTag: 'DISPATCH NOTE',
        media: [
          {
            title: 'Kinetic Motion Sequence',
            caption: 'Night Running Silhouette',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web28.webp'
          }
        ]
      },
      {
        id: 'ad-zenith',
        title: 'Zenith Acoustic Series',
        client: 'Studio Tokyo • 2023',
        role: 'Commercial Direction',
        description: 'Minimalist audio equipment campaign contrasting brutalist Japanese architecture with resonant acoustic warmth.',
        folder: '/content/advertisement/ad-zenith/',
        thumbnail: '/frames/web34.webp',
        stampCode: 'ACOUSTIC // 2023',
        city: 'TOKYO',
        dateStamp: '19 NOV 2023',
        formatTag: 'EXHIBITION PRINT',
        media: [
          {
            title: 'Zenith Spatial Array',
            caption: 'Brutalist Studio Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web34.webp'
          }
        ]
      }
    ]
  },
  {
    id: 'generative-ai',
    title: 'GENERATIVE AI',
    coverIcon: '/icons/GENERATIVE AI.png',
    artist: 'Basil Jose',
    tagline: 'Latent space exploration, neural choreography, synthetic cinema, and generative geometry.',
    projects: [
      {
        id: 'ai-synapse',
        title: 'Neural Synapse Experience',
        client: 'MindWave Labs • 2024',
        role: 'Diffusion Modeling & Visual Direction',
        description: 'Real-time brainwave-driven visual installation generating organic branching neural networks in latent space.',
        folder: '/content/generative-ai/ai-synapse/',
        thumbnail: '/frames/web05.webp',
        stampCode: 'NEURAL // 2024',
        city: 'SAN FRANCISCO',
        dateStamp: '08 NOV 2024',
        formatTag: 'AIRMAIL POSTCARD',
        media: [
          {
            title: 'Synapse Latent Cascade',
            caption: 'Generative Neural Simulation',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/generative-ai/ai-synapse/reel.mp4'
          }
        ]
      },
      {
        id: 'ai-dreamscapes',
        title: 'Latent Dreamscapes',
        client: 'Ars Electronica • 2024',
        role: 'Generative System Design',
        description: 'Infinite recursive panoramic landscapes evolving seamlessly through custom fine-tuned diffusion models.',
        folder: '/content/generative-ai/ai-dreamscapes/',
        thumbnail: '/frames/web12.webp',
        stampCode: 'SYNTHETIC // 2024',
        city: 'TORONTO',
        dateStamp: '22 JUL 2024',
        formatTag: 'EDITORIAL MEMO',
        media: [
          {
            title: 'Infinite Horizon Mutation',
            caption: 'Latent Journey Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web12.webp'
          }
        ]
      },
      {
        id: 'ai-flora',
        title: 'Kinetic Algorithmic Flora',
        client: 'Biophilic AI • 2024',
        role: 'Procedural Direction & Shading',
        description: 'Procedural botanical specimens blooming through mathematical algorithmic growth and generative phyllotaxis.',
        folder: '/content/generative-ai/ai-flora/',
        thumbnail: '/frames/web19.webp',
        stampCode: 'LATENT // 2024',
        city: 'KYOTO',
        dateStamp: '14 APR 2024',
        formatTag: 'EXHIBITION PRINT',
        media: [
          {
            title: 'Algorithmic Blossom',
            caption: 'Phyllotaxis Micro Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web19.webp'
          }
        ]
      },
      {
        id: 'ai-cybernetic',
        title: 'Cybernetic Echoes',
        client: 'Sound & Vision AI • 2023',
        role: 'Audio-Reactive Generative Video',
        description: 'Multi-modal audiovisual installation pairing synthesized soundscapes with dynamic AI geometry.',
        folder: '/content/generative-ai/ai-cybernetic/',
        thumbnail: '/frames/web26.webp',
        stampCode: 'ECHOES // 2023',
        city: 'REYKJAVIK',
        dateStamp: '30 OCT 2023',
        formatTag: 'ARCHIVE INDEX',
        media: [
          {
            title: 'Cybernetic Waveform Resonance',
            caption: 'Audio-Reactive Geometric Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web26.webp'
          }
        ]
      },
      {
        id: 'ai-chronos',
        title: 'Chronos Latent Symphony',
        client: 'NeuroCinema • 2024',
        role: 'Generative Worldbuilding & AI Direction',
        description: 'Real-time diffusion canvas weaving infinite panoramic landscape evolutions with synthetic cinematic textures.',
        folder: '/content/generative-ai/ai-chronos/',
        thumbnail: '/frames/web33.webp',
        stampCode: 'DIFFUSION // 2024',
        city: 'SEOUL',
        dateStamp: '17 JAN 2024',
        formatTag: 'DISPATCH NOTE',
        media: [
          {
            title: 'Chronos Temporal Flux',
            caption: 'Temporal Diffusion Panorama',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web33.webp'
          }
        ]
      }
    ]
  },
  {
    id: 'graphic-designs',
    title: 'GRAPHIC DESIGNS',
    coverIcon: '/icons/GRAPHIC DESIGN.png',
    artist: 'Basil Jose',
    tagline: 'Bauhaus systems, Swiss typography, publication layouts, and visual identity.',
    projects: [
      {
        id: 'gd-synthesis',
        title: 'Synthesis Bauhaus Archive',
        client: 'Kraftwerk Archiv • 2024',
        role: 'Visual Identity & Publication Design',
        description: 'Geometric Swiss grid systems, stark typographic hierarchy, and limited-edition exhibition catalogue.',
        folder: '/content/graphic-designs/gd-synthesis/',
        thumbnail: '/frames/web02.webp',
        stampCode: 'BAUHAUS // 2024',
        city: 'WEIMAR',
        dateStamp: '25 SEP 2024',
        formatTag: 'AIRMAIL POSTCARD',
        media: [
          {
            title: 'Bauhaus Typographic System',
            caption: 'Exhibition Master Grid',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web02.webp'
          }
        ]
      },
      {
        id: 'gd-brutalist',
        title: 'Brutalist Mono Type System',
        client: 'Independent Foundry • 2024',
        role: 'Typeface Specimen & Editorial',
        description: 'Monospaced typographic specimen book with tactile spot-varnish detailing and oversized posters.',
        folder: '/content/graphic-designs/gd-brutalist/',
        thumbnail: '/frames/web08.webp',
        stampCode: 'TYPOGRAPHY // 2024',
        city: 'ZÜRICH',
        dateStamp: '11 JUN 2024',
        formatTag: 'EDITORIAL MEMO',
        media: [
          {
            title: 'Brutalist Glyphic Specimen',
            caption: 'Specimen Sheet No. 4',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web08.webp'
          }
        ]
      },
      {
        id: 'gd-echoes',
        title: 'Echoes Vinyl Packaging',
        client: 'Horizon Records • 2023',
        role: 'Album Art & Packaging Design',
        description: 'Embossed gatefold vinyl album sleeve with foil-stamped lyrics, custom inner sleeves, and center labels.',
        folder: '/content/graphic-designs/gd-echoes/',
        thumbnail: '/frames/web15.webp',
        stampCode: 'VINYL LP // 2023',
        city: 'AMSTERDAM',
        dateStamp: '03 DEC 2023',
        formatTag: 'EXHIBITION PRINT',
        media: [
          {
            title: 'Gatefold Packaging Mockup',
            caption: 'Embossed Sleeve Detail',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web15.webp'
          }
        ]
      },
      {
        id: 'gd-posters',
        title: 'Modernity Poster Series',
        client: 'Design Museum • 2023',
        role: 'Silkscreen Print Collection',
        description: 'Four-part screenprinted poster series exploring rhythm, repetition, and mid-century modern architecture.',
        folder: '/content/graphic-designs/gd-posters/',
        thumbnail: '/frames/web21.webp',
        stampCode: 'SILKSCREEN // 2023',
        city: 'BASEL',
        dateStamp: '18 AUG 2023',
        formatTag: 'ARCHIVE INDEX',
        media: [
          {
            title: 'Modernity Quadriptych No. 2',
            caption: 'Silkscreen Serigraph Proof',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web21.webp'
          }
        ]
      },
      {
        id: 'gd-monolith',
        title: 'Monolith Identity & Exhibition',
        client: 'Zurich Design Biennale • 2024',
        role: 'Brand Architecture & Systems',
        description: 'Architectural brand identity featuring rigid Swiss grid systems, bespoke typography, and blind-debossed collateral.',
        folder: '/content/graphic-designs/gd-monolith/',
        thumbnail: '/frames/web30.webp',
        stampCode: 'IDENTITY // 2024',
        city: 'STOCKHOLM',
        dateStamp: '09 MAR 2024',
        formatTag: 'DISPATCH NOTE',
        media: [
          {
            title: 'Monolith Architectural Collateral',
            caption: 'Exhibition Identity Suite',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web30.webp'
          }
        ]
      }
    ]
  },
  {
    id: 'photography',
    title: 'PHOTOGRAPHY',
    coverIcon: '/icons/PHOTOGRAPHY.png',
    artist: 'Basil Jose',
    tagline: '35mm analog film grain, chiaroscuro architecture, and honest portraiture.',
    projects: [
      {
        id: 'photo-chiaroscuro',
        title: 'Chiaroscuro Concrete',
        client: '35mm Analog • 2024',
        role: 'Architectural Photography',
        description: 'High-contrast black & white series capturing angular shadows carving across brutalist architectural monoliths.',
        folder: '/content/photography/photo-chiaroscuro/',
        thumbnail: '/frames/web03.webp',
        stampCode: '35MM ANALOG // 2024',
        city: 'MILANO',
        dateStamp: '14 OCT 2024',
        formatTag: 'AIRMAIL POSTCARD',
        media: [
          {
            title: 'Brutalist Monolith Shadow',
            caption: 'Ilford HP5 Plus 400',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web03.webp'
          }
        ]
      },
      {
        id: 'photo-nocturne',
        title: 'Nocturne Solitude',
        client: 'Cinestill 800T • 2024',
        role: 'Urban Night Photography',
        description: 'Midnight streetscapes rendered in halation glow, saturated sodium vapor, and silent rain reflections.',
        folder: '/content/photography/photo-nocturne/',
        thumbnail: '/frames/web09.webp',
        stampCode: 'CINESTILL // 2024',
        city: 'HONG KONG',
        dateStamp: '29 MAY 2024',
        formatTag: 'EDITORIAL MEMO',
        media: [
          {
            title: 'Midnight Halation Glow',
            caption: 'Cinestill 800T Exposure',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web09.webp'
          }
        ]
      },
      {
        id: 'photo-horizons',
        title: 'Quiet Horizons',
        client: 'Medium Format 120 • 2023',
        role: 'Seascape Series',
        description: 'Minimalist coastal horizons captured on medium format film during the tranquil moments before dawn.',
        folder: '/content/photography/photo-horizons/',
        thumbnail: '/frames/web17.webp',
        stampCode: 'MEDIUM FORMAT // 2023',
        city: 'OSLO',
        dateStamp: '07 SEP 2023',
        formatTag: 'EXHIBITION PRINT',
        media: [
          {
            title: 'Dawn Coastal Minimal',
            caption: 'Mamiya 7II • Kodak Portra 160',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web17.webp'
          }
        ]
      },
      {
        id: 'photo-portraits',
        title: 'Intimate Profiles',
        client: 'Natural Light • 2023',
        role: 'Editorial Portraiture',
        description: 'Candid black & white portraits exploring vulnerable human expression and unadorned natural light.',
        folder: '/content/photography/photo-portraits/',
        thumbnail: '/frames/web24.webp',
        stampCode: 'MONO // 2023',
        city: 'NEW YORK',
        dateStamp: '16 APR 2023',
        formatTag: 'ARCHIVE INDEX',
        media: [
          {
            title: 'Natural Light Study No. 1',
            caption: 'Tri-X 400 Candid Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web24.webp'
          }
        ]
      },
      {
        id: 'photo-monochrome',
        title: 'Silent Geometry',
        client: 'Hasselblad 500C • 2024',
        role: 'Format Architectural Photography',
        description: 'Monochromatic architectural survey celebrating raw concrete, sharp geometry, and early morning fog.',
        folder: '/content/photography/photo-monochrome/',
        thumbnail: '/frames/web32.webp',
        stampCode: 'HASSELBLAD // 2024',
        city: 'COPENHAGEN',
        dateStamp: '22 JAN 2024',
        formatTag: 'DISPATCH NOTE',
        media: [
          {
            title: 'Geometric Staircase Abstraction',
            caption: 'Hasselblad 500C • 80mm f/2.8',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web32.webp'
          }
        ]
      }
    ]
  },
  {
    id: 'videography',
    title: 'VIDEOGRAPHY',
    coverIcon: '/icons/VIDEOGRAPHY.png',
    artist: 'Basil Jose',
    tagline: 'Anamorphic cinematography, rhythmic montage editing, and music film direction.',
    projects: [
      {
        id: 'video-deep-blue',
        title: 'The Deep Blue',
        client: 'Anamorphic 2.39:1 • 2024',
        role: 'Cinematography & Direction',
        description: 'Meditative short film chronicling a solitary diver perched high above the open azure sea.',
        folder: '/content/videography/video-deep-blue/',
        thumbnail: '/frames/web04.webp',
        stampCode: 'ANAMORPHIC // 2024',
        city: 'MARSEILLE',
        dateStamp: '19 SEP 2024',
        formatTag: 'AIRMAIL POSTCARD',
        media: [
          {
            title: 'The Deep Blue Opening Cut',
            caption: 'Anamorphic Master',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/videography/video-showreel/reel.mp4'
          }
        ]
      },
      {
        id: 'video-after-hours',
        title: 'After Hours Transmission',
        client: 'Music Film • 2024',
        role: 'Direction & Montage Edit',
        description: 'Nocturnal narrative music video featuring dynamic tracking camera shots and intense color grading.',
        folder: '/content/videography/video-after-hours/',
        thumbnail: '/frames/web11.webp',
        stampCode: 'NIGHT REEL // 2024',
        city: 'LOS ANGELES',
        dateStamp: '02 JUL 2024',
        formatTag: 'EDITORIAL MEMO',
        media: [
          {
            title: 'After Hours Transmission Cut',
            caption: 'Tracking Camera Pass',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/videography/video-showreel/reel.mp4'
          }
        ]
      },
      {
        id: 'video-cadence',
        title: 'Solitary Cadence',
        client: 'Super 16mm Documentary • 2023',
        role: 'Director of Photography',
        description: 'Intimate tactile documentary observing traditional master craftsmen working in analog studio spaces.',
        folder: '/content/videography/video-cadence/',
        thumbnail: '/frames/web18.webp',
        stampCode: 'SUPER 16 // 2023',
        city: 'LISBON',
        dateStamp: '11 NOV 2023',
        formatTag: 'EXHIBITION PRINT',
        media: [
          {
            title: 'Artisan Workshop Hands',
            caption: 'Super 16mm Grain Frame',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web18.webp'
          }
        ]
      },
      {
        id: 'video-showreel',
        title: 'Basil Jose Visual Showreel',
        client: 'Selected Works • 2024',
        role: 'Editing, Color & Direction',
        description: 'Fast-paced montage showreel showcasing commercial editing, narrative pacing, and cinematic style.',
        folder: '/content/videography/video-showreel/',
        thumbnail: '/frames/web00.webp',
        stampCode: 'SHOWREEL // 2024',
        city: 'DUBAI',
        dateStamp: '15 JAN 2024',
        formatTag: 'ARCHIVE INDEX',
        media: [
          {
            title: 'Basil Jose Master Showreel (2024)',
            caption: 'Full 4K Reel Montage',
            aspectRatio: '16:9',
            featured: true,
            type: 'video',
            src: '/content/videography/video-showreel/reel.mp4'
          }
        ]
      },
      {
        id: 'video-lumina',
        title: 'Lumina Kinetic Dance',
        client: 'Choreographic Film • 2024',
        role: 'Director & Lead Colorist',
        description: 'High-contrast visual poem capturing contemporary dance through fluid steady-cam cinematography and deep celluloid grain.',
        folder: '/content/videography/video-lumina/',
        thumbnail: '/frames/web25.webp',
        stampCode: 'CHOREO // 2024',
        city: 'BARCELONA',
        dateStamp: '05 MAY 2024',
        formatTag: 'DISPATCH NOTE',
        media: [
          {
            title: 'Lumina Fluid Steady-Cam Take',
            caption: '35mm Film Still',
            aspectRatio: '16:9',
            featured: true,
            type: 'image',
            src: '/frames/web25.webp'
          }
        ]
      }
    ]
  }
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}

export function getProjectById(categoryId, projectId) {
  const category = getCategoryById(categoryId);
  if (!category || !category.projects) return null;
  return category.projects.find(p => p.id === projectId) || category.projects[0];
}
`;

fs.writeFileSync('src/data/categories.js', data, 'utf8');
console.log('src/data/categories.js written successfully');
