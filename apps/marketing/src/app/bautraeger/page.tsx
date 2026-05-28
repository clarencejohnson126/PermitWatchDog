import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionWrapper from '../../components/SectionWrapper';
import Image from 'next/image';
import CTAButton from '../../components/CTAButton';

export default function BautraegerPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <SectionWrapper>
        <div className="max-w-3xl mb-24">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-4">
            Für Bauträger & Projektentwickler
          </p>
          <h1 className="text-5xl md:text-7xl font-sans tracking-widest text-white mb-6 uppercase">
            RISIKO-<span className="text-blue">MINIMIERUNG.</span>
          </h1>
          <p className="font-body text-xl text-zinc-400 leading-relaxed">
            Schützen Sie Ihr Projektportfolio vor unvorhergesehenen behördlichen Eingriffen.
            Skalierbare Überwachung für Entwickler, die nichts dem Zufall überlassen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] w-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl order-2 md:order-1">
            <Image 
              src="/images/bautraeger_executive.png" 
              alt="Bauträger Executive" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-4xl text-white mb-8 leading-tight">
              Marge schützen. Bauverzug proaktiv managen.
            </h2>
            <div className="space-y-6 font-body text-zinc-400 text-lg leading-relaxed">
              <p>
                Als Bauträger tragen Sie das finanzielle Risiko. Jeder Tag Baustopp 
                schmälert die Rendite. PermitWatchDog agiert wie ein digitaler 
                Inhouse-Jurist, der die Entwicklungen der Stadt permanent mit 
                Ihren Genehmigungsauflagen abgleicht.
              </p>
              <p>
                Sie erhalten Frühwarnungen lange bevor Probleme eskalieren. 
                Die KI-gestützte Doktrin-Engine unterscheidet präzise zwischen 
                irrelevanten Rauschen und echten Bedrohungen des Bestandsschutzes.
              </p>
              <div className="pt-8">
                <CTAButton href="/preise">ZUM PIPELINE-PLAN (T1)</CTAButton>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
