import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { countriesES, countriesEN } from "@/i18n/countries";
import { getGenderNameByLocale } from "@/i18n/genders";
import { getRelationLabelByLocale } from "@/i18n/relations";
import { useLanguage, useTranslation } from "@/core/context/LanguageContext";

interface UserCardProps {
  user: {
    id: string;
    uid?: string;
    name?: string;
    displayName?: string;
    email?: string;
    avatar?: string;
    photoURL?: string;
    birthdate?: string | Date;
    age?: number | string;
    phone?: string;
    type?: string;
    relation?: string;
    gender?: string;
    nationality?: string;
    isMember?: boolean;
    hasWebAccess?: boolean;
  };
  showRelation?: boolean;
  showPhone?: boolean;
  showNationality?: boolean;
}

export function UserCard({ 
  user, 
  showRelation = true,
  showPhone = true,
  showNationality = true
}: UserCardProps) {
  const { language } = useLanguage();
  const translate = useTranslation();
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);

  const userName = user.name || user.displayName || translate.form.noName;
  const userAvatar = user.avatar || user.photoURL || "/user_default.png";
  const countries = language === "es" ? countriesES : countriesEN;
  const dateLocale = language === "es" ? "es-ES" : "en-US";
  const yearsLabel = translate.userCard?.age || (language === "es" ? "años" : "years");

  const relationLabel = user.relation
    ? getRelationLabelByLocale(language, user.relation, user.gender || "neutral")
    : "";

  // Obtener URL de la bandera desde FlagsAPI
  const getCountryFlagUrl = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '';
    return `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;
  };

  // Obtener nombre del país por código
  const getCountryName = (code: string): string => {
    const country = countries.find(c => c.code === code.toUpperCase());
    return country ? country.name : code;
  };

  const calculateAge = (birthdate: string | Date): number => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = user.age || (user.birthdate ? calculateAge(user.birthdate) : null);

  const formattedBirthdate = user.birthdate
    ? new Date(user.birthdate).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all duration-300 min-h-[400px] w-full group">
        
        {/* Avatar centrado y destacado */}
        <div className="relative">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-md cursor-pointer hover:shadow-lg hover:border-primary transition-all"
            onClick={() => setIsAvatarExpanded(true)}
          >
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay con lupa */}
          <div 
            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer"
            onClick={() => setIsAvatarExpanded(true)}
          >
            <FontAwesomeIcon 
              icon={["fas", "search-plus"]} 
              className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Badge de membresía en la esquina del avatar */}
          {user.isMember !== undefined && (
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-card shadow-lg ${
              user.isMember
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}>
              <FontAwesomeIcon 
                icon={["fas", user.isMember ? "check" : "minus"]} 
                className="text-white text-lg"
              />
            </div>
          )}
        </div>

        {/* Nombre centrado */}
        <div className="text-center w-full">
          <h3 className="text-xl font-bold text-text-primary line-clamp-2 break-words">
            {userName}
          </h3>
        </div>

        {/* Relación centrada y en negrita */}
        {showRelation && relationLabel && (
          <div className="text-center">
            <p className="text-sm font-extrabold text-primary uppercase tracking-wide">
              {relationLabel}
            </p>
          </div>
        )}

        {/* Divider sutil */}
        <div className="w-12 h-0.5 bg-border rounded-full"></div>

        {/* Información en formato minimalista */}
        <div className="w-full space-y-3 text-sm text-text-primary">
          
          {/* Nacionalidad con bandera - Solo si existe */}
          {showNationality && user.nationality && (
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={["fas", "flag"]} className="text-blue-500 flex-shrink-0" />
              {user.nationality.length === 2 ? (
                <>
                  <span>{getCountryName(user.nationality)}</span>
                  <img 
                    src={getCountryFlagUrl(user.nationality)} 
                    alt={user.nationality}
                    className="w-8 h-8 flex-shrink-0 rounded"
                  />
                </>
              ) : (
                <span>{user.nationality}</span>
              )}
            </div>
          )}

          {/* Email - Solo si existe */}
          {user.email && (
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={["fas", "envelope"]} className="text-blue-500 mt-1 flex-shrink-0" />
              <span className="break-words line-clamp-2">{user.email}</span>
            </div>
          )}

          {/* Edad y Nacimiento - Solo si existe */}
          {formattedBirthdate && (
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={["fas", "birthday-cake"]} className="text-blue-500 mt-1 flex-shrink-0" />
              <span>
                {formattedBirthdate}
                {userAge && (
                  <strong className="text-text-secondary">
                    {" "}({userAge} {yearsLabel})
                  </strong>
                )}
              </span>
            </div>
          )}

          {/* Género - Solo si existe */}
          {user.gender && (
            <div className="flex items-start gap-3">
              <FontAwesomeIcon 
                icon={["fas", user.gender === 'male' ? 'mars' : user.gender === 'female' ? 'venus' : 'genderless']} 
                className="text-blue-500 mt-1 flex-shrink-0"
              />
              <span>
                {getGenderNameByLocale(language, user.gender)}
              </span>
            </div>
          )}

          {/* Teléfono - Solo si existe */}
          {showPhone && user.phone && (
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={["fas", "phone"]} className="text-blue-500 mt-1 flex-shrink-0" />
              <span className="break-words">{user.phone}</span>
            </div>
          )}
          {/* Acceso Web - Solo si está definido */}
          {user.hasWebAccess !== undefined && (
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={["fas", "globe"]} className="text-blue-500 mt-1 flex-shrink-0" />
              <span className="flex items-center gap-2">
                {translate.userCard?.webAccess || translate.form?.hasWebAccess || 'Acceso web'}:
                <span className={`font-semibold ${
                  user.hasWebAccess
                    ? 'text-success'
                    : 'text-error'
                }`}>
                  {user.hasWebAccess ? (translate.common?.yes || 'Sí') : (translate.common?.no || 'No')}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen expandida */}
      {isAvatarExpanded && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsAvatarExpanded(false)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              className="absolute -top-12 right-0 p-2 rounded-lg text-white hover:text-gray-300 hover:bg-white/10 transition-colors"
              onClick={() => setIsAvatarExpanded(false)}
              aria-label="Cerrar"
            >
              <FontAwesomeIcon icon={["fas", "times"]} className="text-2xl" />
            </button>

            <div className="bg-card rounded-2xl p-4 shadow-2xl">
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-center mt-4 text-lg font-semibold text-text-primary">
                {userName}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}