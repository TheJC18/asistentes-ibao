import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import { CompleteProfileCard } from '@/modules/home/components';
import { RootState } from '@/core/store';

export default function Home() {
  const { profileCompleted, displayName } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();

  // Si el perfil no está completado, mostrar solo el card de completar perfil
  if (profileCompleted === false) {
    return (
      <div className="p-6">
        <CompleteProfileCard />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header con icono centrado - mismo estilo que otras páginas */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FontAwesomeIcon icon={["fas", "home"]} className="text-primary text-3xl" />
          <h1 className="text-3xl font-bold text-text-primary">
            {translate.pages.home.title}
          </h1>
        </div>
        <p className="text-text-secondary text-center max-w-xs mx-auto truncate px-4">
          {translate.pages.home.welcomeUser.replace('{name}', displayName || translate.common.user)}
        </p>
      </div>

      {/* Tarjetas informativas - Diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Tarjeta Familia */}
        <div className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:border-secondary transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "users"]} className="text-secondary text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">{translate.nav.family}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translate.pages.family.title}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta Calendario */}
        <div className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:border-secondary transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="text-secondary text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">{translate.nav.calendar || 'Calendario'}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translate.pages.calendar?.title || 'Calendario'}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta Miembros */}
        <div className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:border-success transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "user-friends"]} className="text-success text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">{translate.nav.members}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translate.pages.members.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Acerca de - Diseño mejorado */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header con borde de color */}
        <div className="border-l-4 border-primary bg-primary-light px-8 py-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {translate.about.title}
          </h2>
        </div>
        <div className="px-8 py-6">
          <p className="text-text-secondary mb-8 leading-relaxed">
            {translate.about.description}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                {translate.about.mainFeatures}
              </h3>
              <ul className="space-y-3">
                {translate.about.features.slice(0, 4).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary group">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                {translate.about.features[4]}
              </h3>
              <ul className="space-y-3">
                {translate.about.features.slice(5).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary group">
                    <span className="w-1.5 h-1.5 bg-success rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
