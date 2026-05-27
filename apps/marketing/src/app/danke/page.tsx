import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function DankePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Vielen Dank!</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Ihre Bestellung war erfolgreich. Wir haben Ihr PermitWatchDog T0-Abonnement aktiviert. In Kürze erhalten Sie eine Bestätigung per E-Mail.
        </p>
        <Link 
          href="/"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
