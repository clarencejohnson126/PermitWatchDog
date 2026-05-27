import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.create({
    data: {
      project_name: "Wohnhaus Q5, 18 — Mannheim Innenstadt",
      address: "Q5, 18, 68159 Mannheim",
      gemarkung: "Mannheim",
      flur: "1",
      flurstueck: "4823/2",
      bauantrag_nr: "BA-2026-MA-00234",
      aktenzeichen: "FB60/2026/0234",
      lifecycle_stage: "im Bau",
      bescheid_auflagen: [
        "Auflage 04: Lärmschutz-Nachweis nach DIN 4109",
        "Auflage 12: PV-Anlage gemäß Solarpflicht",
        "Auflage 17: Nachweis F90 Brandschutz DIN 4102"
      ],
      abstandsflaeche_nachbarn: ["Q5, 17", "Q5, 19", "Q6, 1"]
    }
  });

  console.log('Project seeded:', project.project_name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
