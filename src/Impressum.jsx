import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </a>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Impressum
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="leading-relaxed">
                Maximilian Pfertner<br />
                c/o Lehrstuhl für Siedlungsstruktur und Verkehrsplanung<br />
                Technische Universität München<br />
                Arcisstr. 21<br />
                80333 München
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Kontakt</h2>
              <p className="leading-relaxed">
                E-Mail: <a href="mailto:halfways-meetingfinder@outlook.com" className="text-indigo-600 hover:underline">halfways-meetingfinder@outlook.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Haftungsausschluss</h2>
              
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Haftung für Inhalte</h3>
              <p className="text-sm leading-relaxed">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit 
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß 
                § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 
                bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Haftung für Links</h3>
              <p className="text-sm leading-relaxed">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Urheberrecht</h3>
              <p className="text-sm leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Datenschutz</h2>
              <p className="text-sm leading-relaxed">
                Diese Website verwendet keine Cookies und speichert keine personenbezogenen Daten. Die Nutzung der Website 
                erfolgt anonym. Reisezeiten-Berechnungen werden ausschließlich lokal im Browser durchgeführt und nicht auf 
                einem Server gespeichert.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                Die Kartendarstellung erfolgt über OpenStreetMap bzw. CARTO. Bitte beachten Sie die Datenschutzhinweise 
                der jeweiligen Anbieter:
              </p>
              <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                <li><a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">OpenStreetMap Privacy Policy</a></li>
                <li><a href="https://carto.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">CARTO Privacy Policy</a></li>
              </ul>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Stand: Januar 2026
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}