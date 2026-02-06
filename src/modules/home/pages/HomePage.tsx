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
          <FontAwesomeIcon icon={["fas", "home"]} className="text-blue-600 dark:text-blue-400 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {translate.pages.home.title}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Bienvenido, {displayName || 'Usuario'}
        </p>
      </div>

      {/* Tarjetas informativas - Diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Tarjeta Familia */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "users"]} className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">Familia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Gestiona tu familia y define relaciones
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta Calendario */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-pink-100 dark:hover:shadow-pink-900/20 hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="text-pink-600 dark:text-pink-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">Calendario</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Eventos y cumpleaños importantes
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta Miembros */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-green-100 dark:hover:shadow-green-900/20 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
              <FontAwesomeIcon icon={["fas", "user-friends"]} className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">Miembros</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Directorio de miembros y asistentes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Acerca de - Diseño mejorado */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header con borde de color */}
        <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Acerca de la plataforma
          </h2>
        </div>
        
        <div className="px-8 py-6">
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Plataforma diseñada para facilitar la gestión de grupos familiares y usuarios.
            Herramientas completas para administrar información de miembros y mantener registros organizados.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Características principales
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Gestión completa de perfiles de usuario</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Organización de familias con relaciones definidas</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Calendario integrado de cumpleaños</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Filtrado avanzado de miembros</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Seguridad y privacidad
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Autenticación segura con Firebase</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Control de acceso basado en roles</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Datos protegidos y encriptados</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 group-hover:scale-150 transition-transform"></span>
                  <span>Cumplimiento de estándares de privacidad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
