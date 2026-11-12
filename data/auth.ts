// Clave versionada: permite migrar el formato sin romper sesiones viejas
export const sessionStorageKey = "opendaycare:session:v1";

export type DemoSession = { email: string };

// Valor inicial del campo email (estado por defecto del mockup)
export const demoEmail = "caro@opendaycare.com";

export const invitation = {
  childInitial: "M",
  childName: "Mateo",
  room: "Sala Soles",
  code: "7K4P9",
  email: "lucia.fernandez@gmail.com",
  consent:
    "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.",
};
