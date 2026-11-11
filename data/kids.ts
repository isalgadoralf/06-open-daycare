export type KidTone = "sky" | "rose" | "mint" | "sun" | "violet";

export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  id: string;
  name: string;
  initial: string;
  relation: "Mamá" | "Papá";
  status: ParentStatus;
};

export type Kid = {
  id: string;
  name: string;
  initial: string;
  age: number;
  tone: KidTone;
  birthDate: string;
  admission: string;
  alert?: { cardLabel: string; body: string };
  parents: LinkedParent[];
};

export const room = {
  name: "Sala Soles",
  short: "Soles",
  sectionLabel: "SALA SOLES",
};

export const kids: Kid[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    initial: "M",
    age: 3,
    tone: "sky",
    birthDate: "12 mar 2022",
    admission: "feb 2025",
    alert: {
      cardLabel: "MANÍ",
      body: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
    parents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        initial: "L",
        relation: "Mamá",
        status: "active",
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        initial: "D",
        relation: "Papá",
        status: "pending",
      },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    initial: "S",
    age: 2,
    tone: "rose",
    birthDate: "8 sep 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "carolina-mendez",
        name: "Carolina Méndez",
        initial: "C",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    initial: "B",
    age: 3,
    tone: "mint",
    birthDate: "21 ene 2022",
    admission: "feb 2024",
    parents: [
      {
        id: "paula-ruiz",
        name: "Paula Ruiz",
        initial: "P",
        relation: "Mamá",
        status: "active",
      },
      {
        id: "andres-ruiz",
        name: "Andrés Ruiz",
        initial: "A",
        relation: "Papá",
        status: "active",
      },
    ],
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    initial: "V",
    age: 2,
    tone: "sun",
    birthDate: "3 may 2023",
    admission: "mar 2025",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    initial: "T",
    age: 3,
    tone: "violet",
    birthDate: "17 nov 2022",
    admission: "feb 2024",
    alert: {
      cardLabel: "LACTOSA",
      body: "Intolerancia a la lactosa. Ofrecerle leche sin lactosa y evitar yogures comunes.",
    },
    parents: [
      {
        id: "mariano-diaz",
        name: "Mariano Díaz",
        initial: "M",
        relation: "Papá",
        status: "active",
      },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    initial: "E",
    age: 2,
    tone: "rose",
    birthDate: "30 jun 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "julieta-castro",
        name: "Julieta Castro",
        initial: "J",
        relation: "Mamá",
        status: "pending",
      },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    initial: "L",
    age: 3,
    tone: "sky",
    birthDate: "4 feb 2022",
    admission: "ene 2024",
    parents: [
      {
        id: "romina-romero",
        name: "Romina Romero",
        initial: "R",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    initial: "O",
    age: 2,
    tone: "mint",
    birthDate: "19 ago 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "florencia-vega",
        name: "Florencia Vega",
        initial: "F",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
];

export function getKid(id: string): Kid | undefined {
  return kids.find((kid) => kid.id === id);
}
